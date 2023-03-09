import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { window, workspace, Uri } from 'vscode';

export function createJsonFile(jsonFilePath: string, jsonData: any): string {
  const result_dir = path.join(jsonFilePath, ".result.tmp")
  if (!fs.existsSync(result_dir)) {
    fs.mkdirSync(result_dir)
  }
  const targetFile = path.join(result_dir, `${uuidv4()}.json`)
  const jsonString: string = JSON.stringify(jsonData, null, 2);
  try {
    // TODO: rework this to async file write later
    const jsonFileWriteStream: fs.WriteStream = fs.createWriteStream(targetFile, { encoding: 'utf8' });
    jsonFileWriteStream.write(jsonString);
    jsonFileWriteStream.end();
  } catch (error) {
    const errorMessage: string = `Failed to save file: ${targetFile}`;
    window.showErrorMessage(errorMessage);
  }
  return targetFile
}

export function readConfig(): { [key: string]: string; } {
  if (!workspace.workspaceFolders) return {}
  const workspaceFolder = workspace.workspaceFolders[0].uri.fsPath
  const configFilePath = path.join(workspaceFolder, ".mlsql.config")
  if (!fs.existsSync(configFilePath)) {
    return {}
  }

  const configStr = fs.readFileSync(configFilePath).toString()
  const config: { [key: string]: string; } = {}
  configStr.split("\n").filter(line => line.trim() !== "").filter(line => !line.trim().startsWith("#")).forEach(line => {
    const [key, value] = line.split(/=(.+)/, 2)
    config[key.trim()] = value.trim()
  })
  return config

}