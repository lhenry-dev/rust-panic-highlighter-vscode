import * as vscode from 'vscode';
import { createDecorationType } from './decoration';
import { getSeverityLevel, updateDiagnostics } from './diagnostics';

export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	let decorationType = createDecorationType(context);
	context.subscriptions.push(decorationType);

	let severity = getSeverityLevel();
	let ignoreInTestBlock = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.diagnostic.ignoreInTestBlock', true);
	let ignoredPanics = vscode.workspace.getConfiguration().get<string[]>('rustPanicHighlighter.diagnostic.ignoredPanics', []);
	let minXPositionEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.minXPositionEnabled', true);

	vscode.workspace.textDocuments.forEach(doc => {
		if (doc.languageId === 'rust') {
			updateDiagnostics(doc, diagnosticCollection, decorationType, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
		}
	});

	vscode.workspace.onDidChangeTextDocument(event => {
		if (event.document.languageId === 'rust') {
			updateDiagnostics(event.document, diagnosticCollection, decorationType, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
		}
	});

	vscode.workspace.onDidCloseTextDocument(doc => {
		if (doc.languageId === 'rust') {
			diagnosticCollection.delete(doc.uri);
		}
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document.languageId === 'rust') {
			updateDiagnostics(editor.document, diagnosticCollection, decorationType, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
		}
	});

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('rustPanicHighlighter')) {

			decorationType.dispose();
			decorationType = createDecorationType(context);
			context.subscriptions.push(decorationType);

			severity = getSeverityLevel();
			ignoreInTestBlock = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.diagnostic.ignoreInTestBlock', true);
			ignoredPanics = vscode.workspace.getConfiguration().get<string[]>('rustPanicHighlighter.diagnostic.ignoredPanics', []);
			minXPositionEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.minXPositionEnabled', true);

			vscode.workspace.textDocuments.forEach(doc => {
				if (doc.languageId === 'rust') {
					updateDiagnostics(doc, diagnosticCollection, decorationType, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
				}
			});
		}
	});
}

export function deactivate() { }
