import * as vscode from "vscode";
import {uiProxy} from "./ui-proxy";

export function loadExtentionIfNeed(name: string) {
    /**
     * vscode.extensions.all.map(x => x.id). 
     * They are of the form <extension publisher>.<extension name>
     */
    var ext = vscode.extensions.getExtension(name);
    // is the ext loaded and ready?
    if (ext.isActive == false) {
        ext.activate().then(
            function () {
                uiProxy.println("Extension activated");
                // comment next line out for release
                dumpAllCommand();
                //vscode.commands.executeCommand("xmlTools.formatAsXml");
            },
            function () {
                uiProxy.println("Extension activation failed");
            }
        );
    } 
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