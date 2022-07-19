import { workspace, ExtensionContext, commands, Uri, } from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import { LangServer } from './lang-server';
import { codeManager,CodeManager } from './code-manager';
import { executeAndRender } from './commands-action';
import { MLSQLNotebookController, MLSQLNotebookSerializer } from './notebook';
import {getPortPromise} from 'portfinder'

let client: LanguageClient | undefined;

export async function activate(context: ExtensionContext) {
    
    const port = await getPortPromise()
    
    CodeManager.port = port
    const langServer = new LangServer(context,port)
    client = langServer.create()
    
    // const dataPreviewExt = extUtils.loadExtentionIfNeed("RandomFractalsInc.vscode-data-preview")
    const run = commands.registerCommand("mlsql.run", (fileUri: Uri) => {
        executeAndRender(context, fileUri)
    })

    context.subscriptions.push(run)
    context.subscriptions.push(codeManager)
    context.subscriptions.push(langServer)
    context.subscriptions.push(
        workspace.registerNotebookSerializer('mlsql-notebook', new MLSQLNotebookSerializer())
    )
    context.subscriptions.push(new MLSQLNotebookController());
}

export function deactivate(_: ExtensionContext) : Thenable<void> | undefined  {    
    if (!client) {
        return undefined;
    }
    return client.stop();
}