import * as vscode from 'vscode';
import { uiProxy } from './ui-proxy';
import { codeManager } from './code-manager';
import { createJsonFile } from './file-utils';
import { SqlResultWebView } from './result-webview';
export const executeAndRender = async (exernalExtRender:boolean,fileUri:vscode.Uri)=>{
    let resp = await codeManager.runCode(fileUri) 
    // disable dataPreviewExt        
    if (exernalExtRender) {
        const targetPath = createJsonFile(vscode.workspace.workspaceFolders[0].uri.fsPath,resp["data"])
        uiProxy.println(targetPath)
        vscode.commands.executeCommand("data.preview.on.side",vscode.Uri.file(targetPath));
    }else {
        SqlResultWebView.show(resp, "Data");
    }            
   }