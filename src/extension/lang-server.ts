import * as vscode from "vscode";
import * as fs from 'fs';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';
import * as path from 'path';
import { uiProxy } from "./ui-proxy";
import { readConfig } from "./file-utils";
import * as utils from "./osUtils"
export class LangServer {
    
    private _context: vscode.ExtensionContext;
    private _port: Number;

    constructor(context: vscode.ExtensionContext,port: Number) {
        this._context = context
        this._port = port
    }

    public create(): LanguageClient | undefined {
        const { JAVA_HOME, MLSQL_LANG_HOME } = process.env
        let JAVA_LANG_DIR = JAVA_HOME

        let jdkPath = path.join(__dirname, "mlsql-lang", "jdk8")
        if (utils.isDarwin()) {
            jdkPath = path.join(__dirname,"mlsql-lang","jdk8","Contents","Home")
        }
        
        if (fs.existsSync(jdkPath)) {
            JAVA_LANG_DIR = jdkPath
            //check command executable
            const javaCommand = path.join(JAVA_LANG_DIR, "bin", utils.javaName())
            if(!utils.isExec(javaCommand)){
               utils.chmodx(javaCommand)
            }
        }

        const mlsqlConfig = readConfig()

        uiProxy.println(`Using java from JAVA_HOME:${JAVA_LANG_DIR}`)

        if ("java.home" in mlsqlConfig) {
            uiProxy.println(`Using java from java.home in .mlsql.config :${mlsqlConfig["java.home"]}`)
            JAVA_LANG_DIR = mlsqlConfig["java.home"]
        }

        if (!JAVA_LANG_DIR) {
            uiProxy.println(`
Java 1.8 is required.

Try to:
    1. export JAVA_HOME 
    2. Or configure java.home in .mlsql.config.
            `)
            return
        }

        //-Xmx2048m
        let xmx = ""
        if ("engine.memory" in mlsqlConfig) {
            xmx = `-Xmx${mlsqlConfig["engine.memory"]}`
        }

        let MLSQL_LANG_DIR = MLSQL_LANG_HOME || ""

        if ("engine.home" in mlsqlConfig) {
            uiProxy.println(`Using mlsql lang from engine.home in .mlsql.config :${mlsqlConfig["engine.home"]}`)
            MLSQL_LANG_DIR = mlsqlConfig["engine.home"]
        }

        if (!MLSQL_LANG_DIR) {
            MLSQL_LANG_DIR = path.join(__dirname, "mlsql-lang")
        }

        const executable: string = path.join(JAVA_LANG_DIR, "bin", utils.javaName())
        let classPathSpliter = ":"

        if(utils.isWindows()){
            classPathSpliter = ";"
        }

        // join main,conf,libs,plugin,spark path
        const dirs = ["main", "conf", "libs", "plugin", "spark"] 
        const classPath = dirs.map(dir => path.join(MLSQL_LANG_DIR, dir, "*")).join(classPathSpliter)
        
        const args: string[] = ["-cp",classPath]

        if (xmx) {
            args.unshift(xmx)
        }
        
        if(utils.isWindows()){
            args.unshift("-Dhadoop.home.dir="+path.join(MLSQL_LANG_DIR, "hadoop-3.0.0"))
            args.unshift("-Djava.library.path="+path.join(MLSQL_LANG_DIR, "hadoop-3.0.0","bin"))
        }
        // const serverDebug = ["-Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=1044","-Xdebug"]
        // serverDebug.forEach(item=>args.unshift(item))

        const mainClass = "tech.mlsql.plugins.langserver.launchers.stdio.Launcher"

        uiProxy.println("Start MLSQL lang server: " + [...args, mainClass].join(" "))

        let serverOptions: ServerOptions = {
            command: executable,
            args: [...args, mainClass],
            options: {}
        }

        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'mlsql' }, { scheme: 'vscode-notebook-cell', language: 'mlsql' }],
            initializationOptions: { "spark.mlsql.client": "desktop","engine.streaming.driver.port": this._port.toString(), ...mlsqlConfig }
        }
        const client = new LanguageClient('MLSQL', 'MLSQL Language Server', serverOptions, clientOptions)
        let temp = client.start();          
        this._context.subscriptions.push(temp)
        return client
    }

    public dispose() {

    }

}