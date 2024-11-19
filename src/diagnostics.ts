import * as vscode from 'vscode';

enum PanicType {
    Unwrap = "unwrap(",
    UnwrapUnchecked = "unwrap_unchecked(",
    UnwrapErr = "unwrap_err(",
    UnwrapErrUnchecked = "unwrap_err_unchecked(",
    Expect = "expect(",
    Panic = "panic!(",
    Todo = "todo!(",
    Unimplemented = "unimplemented!("
}

const DiagnosticMessages: Record<PanicType, string> = {
    [PanicType.Unwrap]: "This line contains an 'unwrap()', which will panic if the result is None or Err.",
    [PanicType.UnwrapUnchecked]: "This line contains an 'unwrap_unchecked()', which can cause undefined behavior if the result is None or Err.",
    [PanicType.UnwrapErr]: "This line contains an 'unwrap_err()', which will panic if the result is Ok.",
    [PanicType.UnwrapErrUnchecked]: "This line contains an 'unwrap_err_unchecked()', which can cause undefined behavior if the result is Ok.",
    [PanicType.Expect]: "This line contains an 'expect()', which will panic if the result is None or Err.",
    [PanicType.Panic]: "This line contains a 'panic!' which can cause a runtime panic.",
    [PanicType.Todo]: "This line contains a 'todo!' macro, which is a placeholder and will panic if executed.",
    [PanicType.Unimplemented]: "This line contains an 'unimplemented!' macro, which will panic if executed."
};

export function updateDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection, decorationType: vscode.TextEditorDecorationType): void {
    if (doc.languageId !== 'rust') {
        return;
    }

    const ignoredPanics = vscode.workspace.getConfiguration().get<string[]>('rustPanicHighlighter.diagnostic.ignoredPanics', []);

    let diagnostics: vscode.Diagnostic[] = [];
    let editor = vscode.window.activeTextEditor;
    let rangesToDecorate: vscode.Range[] = [];

    let severity = getSeverityLevel();

    for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);

        if (line.text.trimStart().startsWith("//")) {
            continue;
        }

        let foundType: PanicType | null = null;
        for (const [key, value] of Object.entries(PanicType)) {
            if (!ignoredPanics.includes(key.toLowerCase()) && line.text.includes(value)) {
                foundType = value as PanicType;
                break;
            }
        }

        if (foundType) {
            const diagnosticMessage = DiagnosticMessages[foundType];
            const startIndex = line.text.indexOf(foundType);

            // Skip lines that are too short to contain a panic, BUG FIX
            if (line.text.length <= 2) {
                continue;
            }

            const range = new vscode.Range(i, startIndex, i, line.text.length);
            rangesToDecorate.push(range);

            const diagnostic = new vscode.Diagnostic(
                range,
                diagnosticMessage,
                severity
            );
            diagnostics.push(diagnostic);
        }
    }

    if (editor) {
        editor.setDecorations(decorationType, rangesToDecorate);
    }

    if (diagnostics.length !== 0) {
        diagnosticCollection.set(doc.uri, diagnostics);
    }
}

export function getSeverityLevel(): vscode.DiagnosticSeverity {
    const severitySetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.diagnostic.severity');
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

    return severity;
}
