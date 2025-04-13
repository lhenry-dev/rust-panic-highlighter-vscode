import * as vscode from 'vscode';
import { calculateEditorLineHeight, objectToCssString } from './utils';
import { DiagnosticMessages, maxLengthLine, MinXPositionIconValue, PanicType } from './constants';

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
    decorationTypes: vscode.TextEditorDecorationType[],
    severity: vscode.DiagnosticSeverity,
    ignoredPanics: string[],
    minXPositionEnabled: boolean,
    ignoreInTestBlock: boolean
): void {

    if (doc.languageId !== 'rust') {
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const editor = vscode.window.activeTextEditor;
    const rangesToDecorate: vscode.Range[] = [];

    let inTestBlock = false;
    let braceCount = 0;

    for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);

        if (line.text.trimStart().startsWith("//")) {
            continue;
        }

        if (ignoreInTestBlock) {
            const result = handleTestBlock(line, inTestBlock, braceCount);
            inTestBlock = result.inTestBlock;
            braceCount = result.braceCount;

            if (result.shouldContinue) {
                continue;
            }
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

    applyDecorationsAndDiagnostics(editor, rangesToDecorate, addCssString, minXPositionEnabled, decorationTypes, diagnostics, diagnosticCollection, doc);
}

function applyDecorationsAndDiagnostics(
    editor: vscode.TextEditor | undefined,
    rangesToDecorate: vscode.Range[],
    addCssString: string,
    minXPositionEnabled: boolean,
    decorationTypes: vscode.TextEditorDecorationType[],
    diagnostics: vscode.Diagnostic[],
    diagnosticCollection: vscode.DiagnosticCollection,
    doc: vscode.TextDocument
) {
    if (editor) {
        decorationTypes.forEach(decorationType => {
            editor.setDecorations(decorationType, []); // Remove all existing decorations for this decorationType
        });

        const randomDecorationType = decorationTypes[Math.floor(Math.random() * decorationTypes.length)];

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
            editor.setDecorations(randomDecorationType, decorationOptions);
        } else {
            editor.setDecorations(randomDecorationType, rangesToDecorate);
        }

        if (diagnostics.length === 0) {
            diagnosticCollection.delete(doc.uri);
        } else {
            diagnosticCollection.set(doc.uri, diagnostics);
        }
    }
}

function handleTestBlock(line: vscode.TextLine, inTestBlock: boolean, braceCount: number): { inTestBlock: boolean, braceCount: number, shouldContinue: boolean } {
    if (line.text.includes('#[test]')) {
        inTestBlock = true;
        braceCount = 0;
        return { inTestBlock, braceCount, shouldContinue: true };
    }

    if (inTestBlock) {
        for (const char of line.text) {
            if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    inTestBlock = false;
                }
            }
        }
    }

    return { inTestBlock, braceCount, shouldContinue: inTestBlock };
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