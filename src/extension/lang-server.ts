import * as vscode from "vscode";
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';
import * as path from 'path';
import { uiProxy } from "./ui-proxy";
import { readConfig } from "./file-utils";
export class LangServer {
    private _context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext) {
        this._context = context
    }

    public create(): LanguageClient | undefined {
        const { JAVA_HOME, MLSQL_HOME } = process.env
        let JAVA_LANG_DIR = JAVA_HOME

        const mlsqlConfig = readConfig()

        uiProxy.println(`Using java from JAVA_HOME:${JAVA_LANG_DIR}`)

        if("java.home" in mlsqlConfig) {
            JAVA_LANG_DIR = mlsqlConfig["java.home"]
        }

        if (!JAVA_LANG_DIR) {   
            uiProxy.println(`
            Java >= 1.8 is required.
            
            Try to:
                1. export SPARK_HOME 
                2. Or configure java.home in .mlsql.config.
            `)
            return
        }
        
        //-Xmx2048m
        let xmx = ""
        if ("engine.memory" in mlsqlConfig) {
            xmx = `-Xmx${mlsqlConfig["engine.memory"]}`
        }

        let MLSQL_LANG_DIR = MLSQL_HOME

        if ("engine.home" in mlsqlConfig) {
            MLSQL_LANG_DIR = mlsqlConfig["engine.home"]
        }

        if (!MLSQL_LANG_DIR) {
            MLSQL_LANG_DIR = path.join(__dirname, "mlsql-lang", "mlsql-app_2.4-2.1.0-SNAPSHOT")
        }

        const executable: string = path.join(JAVA_LANG_DIR, "bin", "java")        

        const args: string[] = ["-cp",
            `${path.join(MLSQL_LANG_DIR, "main", "*")}:${path.join(MLSQL_LANG_DIR, "libs", "*")}:${path.join(MLSQL_LANG_DIR, "plugin", "*")}:${path.join(MLSQL_LANG_DIR, "spark", "*")}`]
        
        if(xmx){
            args.unshift(xmx)
        }    
                
        const mainClass = "tech.mlsql.plugins.langserver.launchers.stdio.Launcher"

        uiProxy.println("Start MLSQL lang server: " + [...args, mainClass].join(" "))

        let serverOptions: ServerOptions = {
            command: executable,
            args: [...args, mainClass],
            options: {}
        }

        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'sql', language: 'mlsql' }]
        }
        const client = new LanguageClient('MLSQL', 'MLSQL Language Server', serverOptions, clientOptions)
        let temp = client.start();
        this._context.subscriptions.push(temp)
        return client
    }

    public dispose() {

    }

}