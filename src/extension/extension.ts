import { workspace, ExtensionContext, commands, Uri } from 'vscode';

import { LangServer } from './lang-server';
import { codeManager } from './code-manager';
import { executeAndRender } from './commands-action';
import { MLSQLNotebookController, MLSQLNotebookSerializer } from './notebook';

export function activate(context: ExtensionContext) {
    const langServer = new LangServer(context)
    langServer.create()
    // const dataPreviewExt = extUtils.loadExtentionIfNeed("RandomFractalsInc.vscode-data-preview")
    const run = commands.registerCommand("mlsql.run", (fileUri: Uri) => {
        executeAndRender(false, fileUri)
    })

    context.subscriptions.push(run)
    context.subscriptions.push(codeManager)
    context.subscriptions.push(langServer)
    context.subscriptions.push(
        workspace.registerNotebookSerializer('mlsql-notebook', new MLSQLNotebookSerializer())
    )
    context.subscriptions.push(new MLSQLNotebookController());
}

export function deactivate(_: ExtensionContext) {

}