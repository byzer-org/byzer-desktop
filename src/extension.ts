import { runMain } from 'module';
import * as path from 'path';
import { workspace, ExtensionContext, commands, Uri } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import { CodeManager } from './CodeManager';

export function activate(context: ExtensionContext) {
    const codeManager = new CodeManager()
    const {JAVA_HOME} = process.env
    codeManager.println(`Using java from JAVA_HOME:${JAVA_HOME}`)
    if(!JAVA_HOME) return
    let executable: string = path.join(JAVA_HOME,"bin","java")
    let BASE_DIR=path.join(__dirname,"../../src/mlsql-lang/mlsql-app_2.4-2.1.0-SNAPSHOT")
    const args: string[] = ["-cp",
    `${path.join(BASE_DIR,"main","*")}:${path.join(BASE_DIR,"libs","*")}:${path.join(BASE_DIR,"plugin","*")}:${path.join(BASE_DIR,"spark","*")}`]
    const mainClass = "tech.mlsql.plugins.langserver.launchers.stdio.Launcher"
    let serverOptions: ServerOptions = {
        command: executable,
        args: [...args, mainClass],
        options: {}
    }

    let clientOptions: LanguageClientOptions = {        
        documentSelector: [{ scheme: 'sql', language: 'mlsql' }]
    }

    let disposable = new LanguageClient('MLSQL', 'MLSQL Language Server', serverOptions, clientOptions).start();

    
	context.subscriptions.push(disposable)

    const run = commands.registerCommand("mlsql.run",(fileUri:Uri)=>{
      let executeRun = async ()=>{
        let resp = await codeManager.runCode(fileUri)
        codeManager.println(JSON.stringify(resp))
       }
       executeRun()
    })

    context.subscriptions.push(run)
    context.subscriptions.push(codeManager)
}

export function deactivate(context:ExtensionContext) {

}