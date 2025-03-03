import * as vscode from 'vscode';

import * as execute from './execute';
import * as batchArgs from './arguments';

let batFilePath: string;
batFilePath = ""
let asmFilePath: string;
asmFilePath = ""
let runArgs: any;
runArgs = ""

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('mrun-bat.execBatchFile', () => {
			if (batFilePath == "")
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

			batFilePath = execute.askUserForBatchFile();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('mrun-bat.chooseAssemblyFile', async (): Promise<boolean> => {

			batFilePath = execute.askUserForAssemblyFile();
		})
	);
}


export function deactivate() { }