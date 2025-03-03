import * as vscode from 'vscode';

import * as childProcess from 'child_process';
import * as path from 'path';

const EXTENSION_CONFIG_NAME = "mrun-bat";
const CMD_PATH_CONFIG_KEY = "cmdPath";


/**
 * @param filepath If provided it'll use the file's workspace folder as scope, otherwise it'll try to get the current active filepath.
 * @returns The workspace configuration for this extension _('batchrunner')_
 */
export function getExtensionConfig(filepath?: vscode.Uri) {
    // Try to get the active workspace folder first, to have it read Folder Settings
    let workspaceFolder: vscode.Uri | undefined;
    if (filepath)
        workspaceFolder = vscode.workspace.getWorkspaceFolder(filepath)?.uri;
    else if (vscode.window.activeTextEditor)
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)?.uri;

    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_NAME, workspaceFolder);
}

/**
 * Check if user is running VS Code as admin
 */
export function isRunningAsAdmin() {
    try {
        childProcess.execFileSync("net", ["session"], { "stdio": "ignore" });
        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * Get the absolute path to 'cmd.exe'  
 * Returns undefined if the file could not be located
 */
export async function getCmdPath() {
    const cmdPath = getExtensionConfig().get<string>(CMD_PATH_CONFIG_KEY, "C:\\windows\\System32\\cmd.exe");
    const cmdUri = vscode.Uri.file(cmdPath);

    // Make sure the path points towards an existing file, otherwise show an error message
    if (!await uriExists(cmdUri)) {
        const browseButtonText = "Update path";
        vscode.window.showErrorMessage(`Cmd.exe could not be located at ${cmdPath}`, browseButtonText).then(clickedItem => {
            if (clickedItem === browseButtonText) {
                // Open user settings and search for the cmdPath setting
                const searchPath = `${EXTENSION_CONFIG_NAME}.${CMD_PATH_CONFIG_KEY}`;
                vscode.commands.executeCommand('workbench.action.openSettings', searchPath);
            }
        });

        return undefined;
    }

    return cmdPath;
}

/** Check if a file/directory exists at the given Uri */
export async function uriExists(uri: vscode.Uri) {
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * Check if two Uri's are pointing to the same file
 */
export function compareUri(path1: vscode.Uri, path2: vscode.Uri) {
    return path.normalize(path1.fsPath).toLowerCase() === path.normalize(path2.fsPath).toLowerCase();
}
