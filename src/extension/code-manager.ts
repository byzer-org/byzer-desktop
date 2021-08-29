import * as vscode from "vscode";
import * as HTTP from 'axios';
import * as qs from 'qs'
import { uiProxy } from "./ui-proxy";
import { MLSQLExecuteResponse } from "../common/data";


export class CodeManager implements vscode.Disposable {
    private static _instance: CodeManager;
    private _isRunning: boolean;
    private _runFromExplorer: boolean;
    private _document: vscode.TextDocument | null;
    constructor() {
        this._isRunning = false
        this._runFromExplorer = false
        this._document = null
    }

    public onDidCloseTerminal(): void {
    }

    public async runRawCode(rawCode: string, jobName: string): Promise<MLSQLExecuteResponse | string> {
        try {
            return HTTP.default.post("http://127.0.0.1:9003/run/script", qs.stringify({
                sql: rawCode,
                skipAuth: false,
                includeSchema: true,
                fetchType: "take",
                jobName: jobName,
                owner: "admin"
            })).then((response) => response.data as MLSQLExecuteResponse)
                .catch((error) => error.response.data)
        } catch (error) {
            uiProxy.println(error + "")
        }
        return ""

    }

    public async runCode(fileUri: vscode.Uri): Promise<MLSQLExecuteResponse | string> {
        if (this._isRunning) {
            vscode.window.showInformationMessage("There is one MLSQL file is running.")
            return "";
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
                return "";
            }
        }

        let code = this._document.getText();
        uiProxy.println(`execuge code: ${this._document.fileName}`)
        return this.runRawCode(code, fileUri.fsPath)

    }

    public dispose() {

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
            return "";
        }
    }
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}

export const codeManager = CodeManager.Instance;