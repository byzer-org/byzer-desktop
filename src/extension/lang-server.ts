import * as vscode from "vscode";
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';
import * as path from 'path';
import { uiProxy } from "./ui-proxy";
export class LangServer {
    private _context: vscode.ExtensionContext;    
    constructor(context: vscode.ExtensionContext) {
        this._context = context        
    }

    public create(): LanguageClient | undefined {
        const { JAVA_HOME } = process.env
        uiProxy.println(`Using java from JAVA_HOME:${JAVA_HOME}`)
        if (!JAVA_HOME) return 
        let executable: string = path.join(JAVA_HOME, "bin", "java")
        let BASE_DIR = path.join(__dirname, "../../src/mlsql-lang/mlsql-app_2.4-2.1.0-SNAPSHOT")
        const args: string[] = ["-cp",
            `${path.join(BASE_DIR, "main", "*")}:${path.join(BASE_DIR, "libs", "*")}:${path.join(BASE_DIR, "plugin", "*")}:${path.join(BASE_DIR, "spark", "*")}`]
        const mainClass = "tech.mlsql.plugins.langserver.launchers.stdio.Launcher"
        let serverOptions: ServerOptions = {
            command: executable,
            args: [...args, mainClass],
            options: {}
        }

        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'sql', language: 'mlsql' }]
        }

        let client = new LanguageClient('MLSQL', 'MLSQL Language Server', serverOptions, clientOptions).start();
        this._context.subscriptions.push(client)
    }

    public dispose() {

    }

}