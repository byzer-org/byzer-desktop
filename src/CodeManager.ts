import * as vscode from "vscode";
import * as HTTP from 'axios';
import * as qs from 'qs'

export class CodeManager implements vscode.Disposable {
    private _outputChannel: vscode.OutputChannel;
    private _terminal: vscode.Terminal;
    private _isRunning: boolean;
    private _runFromExplorer: boolean;
    private _document: vscode.TextDocument;
    constructor() {
        this._outputChannel = vscode.window.createOutputChannel("Code");
        this._outputChannel.show();
        this._terminal = null;
    }
    public onDidCloseTerminal(): void {
        this._terminal = null;
    }

    public async runCode(fileUri: vscode.Uri = null): Promise<string> {
        if (this._isRunning) {
            vscode.window.showInformationMessage("There is one MLSQL file is running.")
            return;
        }
        this._runFromExplorer = this.checkIsRunFromExplorer(fileUri);
        if (this._runFromExplorer) {
            this._document = await vscode.workspace.openTextDocument(fileUri);
        } else {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                this._document = editor.document;
            } else {
                vscode.window.showInformationMessage("No file found or selected.");
                return;
            }
        }

        let code = this._document.getText();

        try {
            const response = await HTTP.default.post("http://127.0.0.1:9003/run/script", qs.stringify({
                sql: code,
                skipAuth: false,
                includeSchema: true,
                fetchType: "take",
                jobName: this._document.uri.fsPath                
            }))
            return response.data
        } catch (error) {
            this.println(error)
        }
        return "{}"

    }

    public dispose() {

    }

    public println(s: string) {
        this._outputChannel.appendLine(s)
    }

    private checkIsRunFromExplorer(fileUri: vscode.Uri): boolean {
        const editor = vscode.window.activeTextEditor;
        if (!fileUri || !fileUri.fsPath) {
            return false;
        }
        if (!editor) {
            return true;
        }
        if (fileUri.fsPath === editor.document.uri.fsPath) {
            return false;
        }
        return true;
    }
    private getWorkspaceFolder(): string {
        if (vscode.workspace.workspaceFolders) {
            if (this._document) {
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(this._document.uri);
                if (workspaceFolder) {
                    return workspaceFolder.uri.fsPath;
                }
            }
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else {
            return undefined;
        }
    }
}