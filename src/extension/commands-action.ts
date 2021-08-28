import * as vscode from 'vscode';
import { codeManager } from './code-manager';
import { SqlResultWebView } from './result-webview';
import { MLSQLExecuteResponse } from '../common/data';
export const executeAndRender = async (_: boolean, fileUri: vscode.Uri) => {
    let resp = await codeManager.runCode(fileUri)
    // disable dataPreviewExt            
    // const data = (resp as MLSQLExecuteResponse).data        
    // const targetPath = createJsonFile(vscode.workspace.workspaceFolders?[0]?.uri.fsPath,data)
    // uiProxy.println(targetPath)
    // vscode.commands.executeCommand("data.preview.on.side",vscode.Uri.file(targetPath));
    if (resp){
        SqlResultWebView.show(resp as MLSQLExecuteResponse, "Data");
    }    
}