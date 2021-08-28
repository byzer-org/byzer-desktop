import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';
import { MLSQLExecuteResponse } from '../common/data';
import { codeManager } from './code-manager';
import { SqlResultWebView } from './result-webview';

export interface RawNotebookCell {
    language: string;
    value: string;
    kind: vscode.NotebookCellKind;
}

export class MLSQLNotebookController implements vscode.Disposable {
    readonly controllerId = 'mlsql-notebook-controller';
    readonly notebookType = 'mlsql-notebook';
    readonly label = 'MLSQL Notebook';
    readonly supportedLanguages = ['python', 'markdown', 'mlsql'];

    private readonly _controller: vscode.NotebookController;
    private _executionOrder = 0;
    constructor() {
        this._controller = vscode.notebooks.createNotebookController(
            this.controllerId, this.notebookType, this.label
        )
        this._controller.supportedLanguages = this.supportedLanguages;
        this._controller.supportsExecutionOrder = true;
        this._controller.executeHandler = this._execute.bind(this);
    }

    private _execute(
        cells: vscode.NotebookCell[],
        _notebook: vscode.NotebookDocument,
        _controller: vscode.NotebookController
    ): void {
        for (let cell of cells) {
            this._doExecution(cell);
        }
    }

    private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.executionOrder = ++this._executionOrder;
        execution.start(Date.now()); // Keep track of elapsed time to execute cell.

        const res = await codeManager.runCode(cell.document.uri)

        execution.replaceOutput([
            new vscode.NotebookCellOutput([
                vscode.NotebookCellOutputItem.text(SqlResultWebView.getWebviewContent(res as MLSQLExecuteResponse),'text/html')
            ]),
            new vscode.NotebookCellOutput([
                vscode.NotebookCellOutputItem.json(res)
            ])
        ]);
        execution.end(true, Date.now());
    }

    dispose() {
        this._controller.dispose();
    }
}

export class MLSQLNotebookSerializer implements vscode.NotebookSerializer {
    async deserializeNotebook(
        content: Uint8Array,
        _token: vscode.CancellationToken
    ): Promise<vscode.NotebookData> {
        var contents = new TextDecoder().decode(content);

        let raw: RawNotebookCell[];
        try {
            raw = <RawNotebookCell[]>JSON.parse(contents);
        } catch {
            raw = [];
        }

        const cells = raw.map(
            item => new vscode.NotebookCellData(item.kind, item.value, item.language)
        );

        return new vscode.NotebookData(cells);
    }

    async serializeNotebook(
        data: vscode.NotebookData,
        _token: vscode.CancellationToken
    ): Promise<Uint8Array> {
        let contents: RawNotebookCell[] = [];

        for (const cell of data.cells) {
            contents.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value
            });
        }

        return new TextEncoder().encode(JSON.stringify(contents));
    }
}