import { workspace, ExtensionContext, commands, Uri } from 'vscode';
import * as path from 'path';

import { CodeManager } from './code-manager';
import { LangServer } from './lang-server';
import { UIProxy } from './ui-proxy';
import * as extUtils from './extension-utils';
import {uiProxy} from "./ui-proxy";
import { createJsonFile } from './file-utils';
import { SqlResultWebView } from './result-webview';

export function activate(context: ExtensionContext) {        
    const codeManager = new CodeManager()
    const langServer = new LangServer(context)
    langServer.create()    
    extUtils.loadExtentionIfNeed("RandomFractalsInc.vscode-data-preview")
    const run = commands.registerCommand("mlsql.run",(fileUri:Uri)=>{
      let executeRun = async ()=>{
        let resp = await codeManager.runCode(fileUri)         
        const targetPath = createJsonFile(workspace.workspaceFolders[0].uri.fsPath,resp["data"])              
        commands.executeCommand("data.preview.on.side",Uri.file(targetPath));
        // SqlResultWebView.show(resp["data"], "---");
       }
       executeRun()
    })

    context.subscriptions.push(run)    
    context.subscriptions.push(codeManager)
    context.subscriptions.push(langServer)    
}

export function deactivate(context:ExtensionContext) {

}