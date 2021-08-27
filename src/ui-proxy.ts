import * as vscode from "vscode";

export class UIProxy  implements vscode.Disposable{
    private static _instance: UIProxy;
    private _outputChannel: vscode.OutputChannel;
    constructor() {
        this._outputChannel = vscode.window.createOutputChannel("MLSQL Output");
        this._outputChannel.show();                
    }
    public dispose() {

    }
    public println(s: string) {
        this._outputChannel.appendLine(s)
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
      }
}

export const uiProxy = UIProxy.Instance;