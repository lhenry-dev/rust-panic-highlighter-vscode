import * as vscode from 'vscode';
import { createDecorationType } from './decoration';
import { updateDiagnostics } from './diagnostics';

export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	let decorationType = createDecorationType(context);
	context.subscriptions.push(decorationType);

	vscode.workspace.textDocuments.forEach(doc => {
		if (doc.languageId === 'rust') {
			updateDiagnostics(doc, diagnosticCollection, decorationType);
		}
	});

	vscode.workspace.onDidChangeTextDocument(event => {
		if (event.document.languageId === 'rust') {
			updateDiagnostics(event.document, diagnosticCollection, decorationType);
		}
	});

	vscode.workspace.onDidCloseTextDocument(doc => {
		if (doc.languageId === 'rust') {
			diagnosticCollection.delete(doc.uri);
		}
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document.languageId === 'rust') {
			updateDiagnostics(editor.document, diagnosticCollection, decorationType);
		}
	});

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('rustPanicHighlighter')) {

			decorationType.dispose();
			decorationType = createDecorationType(context);
			context.subscriptions.push(decorationType);

			vscode.workspace.textDocuments.forEach(doc => {
				if (doc.languageId === 'rust') {
					updateDiagnostics(doc, diagnosticCollection, decorationType);
				}
			});
		}
	});
}

export function deactivate() { }
