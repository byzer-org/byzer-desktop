import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';
import { filterPythonError, MLSQLExecuteResponse, ToContent } from '../common/data';
import { codeManager } from './code-manager';
import * as uuid from 'uuid';
import { uiProxy } from './ui-proxy';
import { rewriteSQL } from '../common/hint-manager'

interface RawCellOutput {
    mime: string;
    value: any;
}

interface RawNotebookCell {
    language: string;
    value: string;
    kind: vscode.NotebookCellKind;
    editable?: boolean;
    outputs: RawCellOutput[];
}

interface RunningCell {
    cell: vscode.NotebookCell,
    jobName: string
}

export class MLSQLNotebookController implements vscode.Disposable {
    readonly controllerId = 'mlsql-notebook-controller';
    readonly notebookType = 'mlsql-notebook';
    readonly label = 'MLSQL Notebook';
    readonly supportedLanguages = ['python', 'markdown', 'mlsql','yaml'];

    private runningCells = new Map<RunningCell, boolean>()

    private readonly _controller: vscode.NotebookController;
    private _executionOrder = 0;
    constructor() {
        this._controller = vscode.notebooks.createNotebookController(
            this.controllerId, this.notebookType, this.label
        )
        this._controller.supportedLanguages = this.supportedLanguages;
        this._controller.supportsExecutionOrder = true;
        this._controller.executeHandler = this._execute.bind(this);
        this._controller.interruptHandler = this._interrupt.bind(this)
    }

    private async _interrupt(_notebook: vscode.NotebookDocument) {
        for (let key of this.runningCells.keys()) {
            let msg = ""
            try {
                const res = await codeManager.runRawCode(`!kill "${key.jobName}";`, uuid.v4())
                if (typeof (res) === "string") {
                    msg = res
                } else {
                    msg = JSON.stringify(res, null, 4)
                }
            } catch (e) {

            }
            this.runningCells.delete(key)
            uiProxy.println(msg)
        }
    }

    private async _execute(
        cells: vscode.NotebookCell[],
        _notebook: vscode.NotebookDocument,
        _controller: vscode.NotebookController
    ): Promise<void> {
        for (let cell of cells) {
            await this._doExecution(cell);
        }
    }

    private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.executionOrder = ++this._executionOrder;
        execution.start(Date.now()); // Keep track of elapsed time to execute cell.        
        const jobName = uuid.v4()
        const runningKey = {
            cell: cell,
            jobName: jobName
        }
        const code = rewriteSQL(cell)
        this.runningCells.set(runningKey, true)
        try {
            let res = await codeManager.runRawCode(code, jobName)
            // this is a bug in mlsql lang
            if (res === "{[]}") {
                res = {schema:{fields:[]},data:[]}
            }

            if (typeof (res) === "string") {
                let newRes = res
                if(cell.document.languageId === "python") {
                    newRes = filterPythonError(res)
                }                
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.text(newRes)
                    ])
                ]);
            } else {
                const mime = 'x-application/mlsql-notebook'
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.json(res, mime)
                    ])
                ]);
            }
        } catch (e) {

        }
        this.runningCells.delete(runningKey)
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

        function convertRawOutputToBytes(raw: RawNotebookCell) {
            let result: vscode.NotebookCellOutputItem[] = [];

            for (let output of raw.outputs) {
                let data = new TextEncoder().encode(output.value);
                result.push(new vscode.NotebookCellOutputItem(data, output.mime));
            }

            return result;
        }

        const cells = raw.map(
            item => new vscode.NotebookCellData(item.kind, item.value, item.language)
        );

        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            cell.outputs = raw[i].outputs ? [new vscode.NotebookCellOutput(convertRawOutputToBytes(raw[i]))] : [];
        }

        return new vscode.NotebookData(cells);
    }

    async serializeNotebook(
        data: vscode.NotebookData,
        _token: vscode.CancellationToken
    ): Promise<Uint8Array> {

        function asRawOutput(cell: vscode.NotebookCellData): RawCellOutput[] {
            let result: RawCellOutput[] = [];
            for (let output of cell.outputs ?? []) {
                for (let item of output.items) {
                    let outputContents = '';
                    try {
                        outputContents = new TextDecoder().decode(item.data);
                    } catch {

                    }
                    result.push({ mime: item.mime, value: outputContents });
                }
            }
            return result;
        }

        let contents: RawNotebookCell[] = [];

        for (const cell of data.cells) {
            contents.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
                outputs: asRawOutput(cell)
            });
        }

        return new TextEncoder().encode(JSON.stringify(contents));
    }
}