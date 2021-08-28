import * as vscode from "vscode";
import { activate } from "./extension";
import {uiProxy} from "./ui-proxy";

export function loadExtentionIfNeed(name: string): vscode.Extension<any> | undefined {
    /**
     * vscode.extensions.all.map(x => x.id). 
     * They are of the form <extension publisher>.<extension name>
     */
    var ext = vscode.extensions.getExtension(name);
    if (!ext) return ext
    // is the ext loaded and ready?
    if (ext.isActive == false) {
        ext.activate().then(
            function () {
                uiProxy.println(`Extension ${name} activated`);                
            },
            function () {
                uiProxy.println(`Extension ${name} activation failed`);
            }
        );
    }    
    return ext
}




// dev helper function to dump all the command identifiers to the console
// helps if you cannot find the command id on github.
function dumpAllCommand () {
    vscode.commands.getCommands(true).then(
        function (cmds) {
            console.log("fulfilled");
            console.log(cmds);
        },
        function () {
            console.log("failed");
            console.log(arguments);
        }
    )
};