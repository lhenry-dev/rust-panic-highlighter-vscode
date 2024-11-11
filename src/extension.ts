import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	const decorationType = vscode.window.createTextEditorDecorationType({
		after: {
			contentIconPath: vscode.Uri.file(context.asAbsolutePath('resources/broken.svg')),
			width: '14px',
			height: '14px',
			margin: '0 10px',
		}
	});
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
}

function updateDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection, decorationType: vscode.TextEditorDecorationType): void {
	let diagnostics: vscode.Diagnostic[] = [];
	let editor = vscode.window.activeTextEditor;
	let rangesToDecorate: vscode.Range[] = [];

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
				vscode.DiagnosticSeverity.Warning
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
