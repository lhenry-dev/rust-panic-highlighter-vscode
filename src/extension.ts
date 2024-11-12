import * as vscode from 'vscode';

export const defaultIconPath = 'resources/broken.svg';
export const defaultIconWidth = '14px';
export const defaultIconHeight = '14px';

export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	function createDecorationType(): vscode.TextEditorDecorationType {
		let iconPathSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.iconPath') || '';

		if (!iconPathSetting.endsWith('.svg')) {
			vscode.window.showWarningMessage("Invalid icon path: Only SVG files are supported. Using default icon.");
			iconPathSetting = context.asAbsolutePath(defaultIconPath);
		}

		const iconPath = vscode.Uri.file(iconPathSetting);
		const iconWidthSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.iconWidth') || defaultIconWidth;
		const iconHeightSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.iconHeight') || defaultIconHeight;

		return vscode.window.createTextEditorDecorationType({
			after: {
				contentIconPath: iconPath,
				width: iconWidthSetting,
				height: iconHeightSetting,
				margin: '0 10px',
			},
		});
	}

	let decorationType = createDecorationType();
	context.subscriptions.push(decorationType);

	vscode.workspace.onDidOpenTextDocument(doc => {
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
		diagnosticCollection.delete(doc.uri);
	});

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('rustPanicHighlighter.iconPath') ||
			event.affectsConfiguration('rustPanicHighlighter.iconWidth') ||
			event.affectsConfiguration('rustPanicHighlighter.iconHeight')) {

			decorationType.dispose();
			decorationType = createDecorationType();
			context.subscriptions.push(decorationType);

			vscode.workspace.textDocuments.forEach(doc => {
				if (doc.languageId === 'rust') {
					updateDiagnostics(doc, diagnosticCollection, decorationType);
				}
			});
		}
	});
}

function updateDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection, decorationType: vscode.TextEditorDecorationType): void {
	let diagnostics: vscode.Diagnostic[] = [];
	let editor = vscode.window.activeTextEditor;
	let rangesToDecorate: vscode.Range[] = [];

	const severitySetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.diagnosticSeverity');
	let severity: vscode.DiagnosticSeverity;

	switch (severitySetting) {
		case 'Error':
			severity = vscode.DiagnosticSeverity.Error;
			break;
		case 'Information':
			severity = vscode.DiagnosticSeverity.Information;
			break;
		case 'Hint':
			severity = vscode.DiagnosticSeverity.Hint;
			break;
		case 'Warning':
		default:
			severity = vscode.DiagnosticSeverity.Warning;
			break;
	}

	for (let i = 0; i < doc.lineCount; i++) {
		const line = doc.lineAt(i);

		if (line.text.trimStart().startsWith("//")) {
			continue;
		}

		if (line.text.includes("panic!") || line.text.includes("unwrap(") || line.text.includes("expect(")) {
			let diagnosticMessage = "";

			if (line.text.includes("panic!")) {
				diagnosticMessage = "This line contains a 'panic!' which can cause a runtime panic.";
			} else if (line.text.includes("unwrap(")) {
				diagnosticMessage = "This line contains an 'unwrap()', which will panic if the result is None or Err.";
			} else if (line.text.includes("expect(")) {
				diagnosticMessage = "This line contains an 'expect()', which will panic if the result is None or Err.";
			}

			let diagnostic = new vscode.Diagnostic(
				line.range,
				diagnosticMessage,
				severity
			);
			diagnostics.push(diagnostic);

			const range = new vscode.Range(i, line.text.length, i, line.text.length);
			rangesToDecorate.push(range);
		}
	}

	if (editor && rangesToDecorate.length > 0) {
		editor.setDecorations(decorationType, rangesToDecorate);
	}

	if (diagnostics.length > 0) {
		diagnosticCollection.set(doc.uri, diagnostics);
	}
}

export function deactivate() { }
