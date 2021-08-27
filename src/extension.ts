import { workspace, ExtensionContext, commands, Uri } from 'vscode';
import * as fs  from 'fs';
import * as path from 'path';

import { CodeManager } from './code-manager';
import { LangServer } from './lang-server';
import { UIProxy } from './ui-proxy';
import * as extUtils from './extension-utils';
import {uiProxy} from "./ui-proxy";

export function activate(context: ExtensionContext) {    
    const codeManager = new CodeManager()
    const langServer = new LangServer(context)
    langServer.create()    
    extUtils.loadExtentionIfNeed("RandomFractalsInc.vscode-data-preview")
    const run = commands.registerCommand("mlsql.run",(fileUri:Uri)=>{
      let executeRun = async ()=>{
        let resp = await codeManager.runCode(fileUri)
        let jsonStr = JSON.stringify(resp)        
        fs.writeFileSync(path.join(".",".result","t.json"),jsonStr)        
        // commands.executeCommand("xmlTools.formatAsXml");
       }
       executeRun()
    })

    context.subscriptions.push(run)    
    context.subscriptions.push(codeManager)
    context.subscriptions.push(langServer)    
}

export function deactivate(context:ExtensionContext) {

}