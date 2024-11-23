import * as vscode from 'vscode';
import { calculateEditorLineHeight, objectToCssString } from './utils';
import { maxLengthLine, MinXPositionIconValue } from './constants';

enum PanicType {
    unwrap = "unwrap(",
    unwrap_unchecked = "unwrap_unchecked(",
    unwrap_err = "unwrap_err(",
    unwrap_err_unchecked = "unwrap_err_unchecked(",
    expect = "expect(",
    panic = "panic!(",
    todo = "todo!(",
    unimplemented = "unimplemented!("
}

const DiagnosticMessages: Record<PanicType, string> = {
    [PanicType.unwrap]: "This line contains an 'unwrap()', which will panic if the result is None or Err.",
    [PanicType.unwrap_unchecked]: "This line contains an 'unwrap_unchecked()', which can cause undefined behavior if the result is None or Err.",
    [PanicType.unwrap_err]: "This line contains an 'unwrap_err()', which will panic if the result is Ok.",
    [PanicType.unwrap_err_unchecked]: "This line contains an 'unwrap_err_unchecked()', which can cause undefined behavior if the result is Ok.",
    [PanicType.expect]: "This line contains an 'expect()', which will panic if the result is None or Err.",
    [PanicType.panic]: "This line contains a 'panic!' which can cause a runtime panic.",
    [PanicType.todo]: "This line contains a 'todo!' macro, which is a placeholder and will panic if executed.",
    [PanicType.unimplemented]: "This line contains an 'unimplemented!' macro, which will panic if executed."
};

const fontSize = calculateEditorLineHeight();
const charWidth = fontSize * 0.5;
const leftPosition = MinXPositionIconValue * charWidth;

const addCss = {
    position: 'absolute',
    ['z-index']: 1,
    left: `${leftPosition}px`,
};

const addCssString = objectToCssString(addCss);

export function updateDiagnostics(
    doc: vscode.TextDocument,
    diagnosticCollection: vscode.DiagnosticCollection,
    decorationType: vscode.TextEditorDecorationType,
    severity: vscode.DiagnosticSeverity,
    ignoredPanics: string[],
    minXPositionEnabled: boolean): void {

    if (doc.languageId !== 'rust') {
        return;
    }

    let diagnostics: vscode.Diagnostic[] = [];
    let editor = vscode.window.activeTextEditor;
    let rangesToDecorate: vscode.Range[] = [];

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

    applyDecorationsAndDiagnostics(editor, rangesToDecorate, addCssString, minXPositionEnabled, decorationType, diagnostics, diagnosticCollection, doc);
}

function applyDecorationsAndDiagnostics(
    editor: vscode.TextEditor | undefined,
    rangesToDecorate: vscode.Range[],
    addCssString: string,
    minXPositionEnabled: boolean,
    decorationType: vscode.TextEditorDecorationType,
    diagnostics: vscode.Diagnostic[],
    diagnosticCollection: vscode.DiagnosticCollection,
    doc: vscode.TextDocument
) {
    if (editor) {
        if (minXPositionEnabled) {
            const decorationOptions: vscode.DecorationOptions[] = rangesToDecorate.map(range => {
                const cssToApply = (range.end.character >= maxLengthLine) ? '' : addCssString;

                return {
                    range: range,
                    renderOptions: {
                        after: {
                            textDecoration: cssToApply,
                        },
                    },
                };
            });
            editor.setDecorations(decorationType, decorationOptions);
        } else {
            editor.setDecorations(decorationType, rangesToDecorate);
        }

        if (diagnostics.length === 0) {
            diagnosticCollection.delete(doc.uri);
        } else {
            diagnosticCollection.set(doc.uri, diagnostics);
        }
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