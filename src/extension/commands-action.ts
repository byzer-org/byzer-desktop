import * as vscode from 'vscode';
import { codeManager } from './code-manager';
import { MLSQLExecuteResponse } from '../common/data';
import { ViewLoader } from '../common/view-loader';
import { uiProxy } from './ui-proxy';
export const executeAndRender = async (context: vscode.ExtensionContext, fileUri: vscode.Uri) => {
    let resp = await codeManager.runCode(fileUri)
    // disable dataPreviewExt            
    // const data = (resp as MLSQLExecuteResponse).data        
    // const targetPath = createJsonFile(vscode.workspace.workspaceFolders?[0]?.uri.fsPath,data)
    // uiProxy.println(targetPath)
    // vscode.commands.executeCommand("data.preview.on.side",vscode.Uri.file(targetPath));
    if (typeof resp === "string") {
        uiProxy.println(resp)
    } else {
        const viewLoader = new ViewLoader(context,"JsonToTable" ,"data", "table")        
        const data = resp as MLSQLExecuteResponse 
        viewLoader.postMessageToWebview(data)
        viewLoader.showWebview();
    }

}