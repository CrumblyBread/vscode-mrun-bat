import * as vscode from 'vscode';


interface ICachedArgs {
    [filepath: string]: {
        arg: string
    }
}

let cachedArgs: ICachedArgs = {};


export async function askForArguments() {

    const argString = await vscode.window.showInputBox({
        placeHolder: "Arguments...",
        prompt: "Arguments to pass to the batch file",
    });

    if (argString === undefined) {
        return undefined;
    }

    if (!argString) {
        return [];
    }

    return [argString];
}