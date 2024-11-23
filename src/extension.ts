import * as vscode from 'vscode';
import fs from 'fs';
import { createDecorationType, createDecorationTypes } from './decoration';
import { getSeverityLevel, updateDiagnostics } from './diagnostics';
import { tmpFolderName } from './constants';
import { clearOrCreateDirectoryInTempDir, getIconPath } from './utils';

export function activate(context: vscode.ExtensionContext) {
	clearOrCreateDirectoryInTempDir(tmpFolderName);

	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	let imgPathSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.icon.path') || 'default';
	let imgPath = getIconPath(context, imgPathSetting);

	let decorationTypes: vscode.TextEditorDecorationType[] = [];

	if (fs.lstatSync(imgPath).isDirectory()) {
		decorationTypes = createDecorationTypes(context, imgPath);
	} else {
		decorationTypes = [createDecorationType(context, imgPath)];
	}

	decorationTypes.forEach(decorationType => {
		context.subscriptions.push(decorationType);
	});

	let severity = getSeverityLevel();
	let ignoreInTestBlock = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.diagnostic.ignoreInTestBlock', true);
	let ignoredPanics = vscode.workspace.getConfiguration().get<string[]>('rustPanicHighlighter.diagnostic.ignoredPanics', []);
	let minXPositionEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.minXPositionEnabled', true);

	vscode.workspace.textDocuments.forEach(doc => {
		if (doc.languageId === 'rust') {
			updateDiagnostics(doc, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
		}
	});

	vscode.workspace.onDidChangeTextDocument(event => {
		if (event.document.languageId === 'rust') {
			updateDiagnostics(event.document, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
		}
	});

	vscode.workspace.onDidCloseTextDocument(doc => {
		if (doc.languageId === 'rust') {
			diagnosticCollection.delete(doc.uri);
		}
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document.languageId === 'rust') {
			updateDiagnostics(editor.document, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
		}
	});

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('rustPanicHighlighter')) {

			clearOrCreateDirectoryInTempDir(tmpFolderName);

			decorationTypes.forEach(decorationType => {
				decorationType.dispose();
			});

			imgPathSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.icon.path') || 'default';
			imgPath = getIconPath(context, imgPathSetting);

			if (fs.lstatSync(imgPath).isDirectory()) {
				decorationTypes = createDecorationTypes(context, imgPath);
			} else {
				decorationTypes = [createDecorationType(context, imgPath)];
			}

			decorationTypes.forEach(decorationType => {
				context.subscriptions.push(decorationType);
			});

			severity = getSeverityLevel();
			ignoreInTestBlock = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.diagnostic.ignoreInTestBlock', true);
			ignoredPanics = vscode.workspace.getConfiguration().get<string[]>('rustPanicHighlighter.diagnostic.ignoredPanics', []);
			minXPositionEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.minXPositionEnabled', true);

			vscode.workspace.textDocuments.forEach(doc => {
				if (doc.languageId === 'rust') {
					updateDiagnostics(doc, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
				}
			});
		}
	});
}

export function deactivate() { }

