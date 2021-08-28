import { workspace, ExtensionContext, commands, Uri } from 'vscode';

import { LangServer } from './lang-server';
import * as extUtils from './extension-utils';
import { codeManager } from './code-manager';
import { executeAndRender } from './commands-action';

export function activate(context: ExtensionContext) {            
    const langServer = new LangServer(context)
    langServer.create()    
    const dataPreviewExt = extUtils.loadExtentionIfNeed("RandomFractalsInc.vscode-data-preview")
    const run = commands.registerCommand("mlsql.run",(fileUri:Uri)=>{
        executeAndRender(!dataPreviewExt,fileUri)
    })

    context.subscriptions.push(run)    
    context.subscriptions.push(codeManager)
    context.subscriptions.push(langServer)    
}

export function deactivate(context:ExtensionContext) {

}