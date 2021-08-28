import * as vscode from "vscode";
import {
    generateTable,
    generateHTMLTable,
    generateExcel,
    parseDataToSchema
} from 'json5-to-table'
import { uiProxy } from "./ui-proxy";
//  // Get path to resource on disk
//  const onDiskPath = vscode.Uri.file( 
//     path.join(context.extensionPath, 'css', 'style.css')
//  );
//  // And get the special URI to use with the webview
//  const cssURI = panel.webview.asWebviewUri(onDiskPath);
// then put the cssURI to html page.
export class SqlResultWebView {
    private static instance: vscode.WebviewPanel
    public static show(data, title) {
        if (SqlResultWebView.instance) {
            SqlResultWebView.instance.dispose()
        }
        SqlResultWebView.instance = vscode.window.createWebviewPanel("MLSQL", title, vscode.ViewColumn.Two, {
            retainContextWhenHidden: true,
            enableScripts: true
        });

        SqlResultWebView.instance.webview.html = SqlResultWebView.getWebviewContent(data);
        uiProxy.println(SqlResultWebView.instance.webview.html)
    }

    public static getWebviewContent(data): string {
        const head = [].concat(
            "<!DOCTYPE html>",
            "<html>",
            "<head>",
            '<meta http-equiv="Content-type" content="text/html;charset=UTF-8">',
            "<style>table{border-collapse:collapse; }table,td,th{border:1px dotted #ccc; padding:5px;}th {background:#444} </style>",
            "</head>",
            "<body>",
        ).join("\n");

        const body = SqlResultWebView.render(data);

        const tail = [
            "</body>",
            "</html>",
        ].join("\n");

        return head + body + tail;
    }

    private static render(res: Object) {
        const fields = res["schema"]["fields"] as Array<{ name: string }>
        const schema = fields.map((item) => {
            return { "title": item.name, "path": item.name }
        })
        return generateHTMLTable(res["data"], schema)
    }

}
