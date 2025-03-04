import * as vscode from 'vscode';

import * as execute from './execute';
import * as batchArgs from './arguments';

let batFilePath: vscode.Uri;
let runArgs: any;
runArgs = ""

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('mrun-bat.execBatchFile', () => {
			if (batFilePath == undefined)
				throw new Error('No file path provided');

			return execute.runBatchFile(batFilePath, runArgs, false);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('mrun-bat.changeBatchFileArgs', async () => {

			const argsToPass = await batchArgs.askForArguments();
			if (argsToPass !== undefined) {
				runArgs = argsToPass;
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('mrun-bat.chooseBatchFile', async () => {

			const result = await execute.askUserForBatchFile();

			if(result){
				batFilePath = result
			}
		})
	);
}


export function deactivate() { }