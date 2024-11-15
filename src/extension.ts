import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sizeOf from "image-size";

export const defaultIconPath = 'resources/panic-icon.gif';
export const defaultIconWidth = 64;
export const defaultIconHeight = 64;
export const defaultAdjustTopPosition = 0;

function objectToCssString(settings: any): string {
	let value = '';
	const cssString = Object.keys(settings).map(setting => {
		value = settings[setting];
		if (typeof value === 'string' || typeof value === 'number') {
			return `${setting}: ${value};`;
		}
	}).join(' ');

	return cssString;
}

function calculateEditorLineHeight(): number {
	const editorConfig = vscode.workspace.getConfiguration('editor');
	const fontSize = editorConfig.get<number>('fontSize') || 14;
	const lineHeightSetting = editorConfig.get<number>('lineHeight') || 0;

	let lineHeight: number;
	if (lineHeightSetting === 0) {
		lineHeight = fontSize;
	} else if (lineHeightSetting > 0 && lineHeightSetting < 8) {
		lineHeight = fontSize * lineHeightSetting;
	} else {
		lineHeight = lineHeightSetting;
	}
	return lineHeight;
}

const getIconPath = (iconPathSetting: string, width: string, height: string) => {
	const ext = path.extname(iconPathSetting).toLowerCase();
	const supportedFormats = ['.gif', '.png', '.jpg', '.jpeg', '.svg'];

	if (supportedFormats.includes(ext)) {
		if (ext === '.svg') {
			try {
				const svgContent = fs.readFileSync(iconPathSetting, 'utf8');

				const modifiedSvgContent = svgContent.replace(
					/<svg([^>]*)>/,
					(_: string, svgAttributes: string) => {
						const hasWidth = /width\s*=\s*["'].*?["']/.test(svgAttributes);
						const hasHeight = /height\s*=\s*["'].*?["']/.test(svgAttributes);

						const newAttributes = svgAttributes
							+ (hasWidth ? '' : ` width="${width}"`)
							+ (hasHeight ? '' : ` height="${height}"`);

						return `<svg${newAttributes}>`;
					}
				);

				const tempDir = os.tmpdir();
				const tempSvgPath = path.join(tempDir, `icon_tmp.svg`);

				fs.writeFileSync(tempSvgPath, modifiedSvgContent, 'utf8');

				return tempSvgPath;
			} catch (error) {
				console.error("Error processing the SVG file:", error);
				throw new Error(`Unable to process the SVG file: ${iconPathSetting}`);
			}
		}

		try {
			const iconData = fs.readFileSync(iconPathSetting);
			const base64Data = iconData.toString('base64');

			let mimeType = '';
			switch (ext) {
				case '.gif':
					mimeType = 'image/gif';
					break;
				case '.png':
					mimeType = 'image/png';
					break;
				case '.jpg':
				case '.jpeg':
					mimeType = 'image/jpeg';
					break;
				default:
					throw new Error(`Unsupported image format: ${ext}`);
			}

			const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <image href="data:${mimeType};base64,${base64Data}" width="${width}" height="${height}"/>
            </svg>
        `;

			const tempDir = os.tmpdir();
			const tempSvgPath = path.join(tempDir, `icon_tmp.svg`);

			fs.writeFileSync(tempSvgPath, svgContent, 'utf8');

			return tempSvgPath;
		} catch (error) {
			console.error('An error occurred while processing the icon:', error);
			throw new Error(`An error occurred while processing the icon: ${iconPathSetting}`);
		}
	}

	throw new Error(`Unsupported image format: ${ext}`);
};


export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	function createDecorationType(): vscode.TextEditorDecorationType {
		const isEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.enabled') ?? true;

		if (!isEnabled) {
			return vscode.window.createTextEditorDecorationType({});
		}

		let iconPathSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.icon.path') || 'default';

		if (iconPathSetting === "default") {
			iconPathSetting = context.asAbsolutePath(defaultIconPath);
		}

		const iconWidthSetting = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.width') || defaultIconWidth;
		const iconHeightSetting = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.height') || defaultIconHeight;

		const adjustTopPosition = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.adjustTopPosition') || defaultAdjustTopPosition;

		if (iconWidthSetting !== undefined && iconWidthSetting <= 0) {
			throw new Error("icon.width must be a positive number.");
		}

		if (iconHeightSetting !== undefined && iconHeightSetting <= 0) {
			throw new Error("icon.height must be a positive number.");
		}

		const iconWidthWithPx = `${iconWidthSetting}px`;
		const iconHeightWithPx = `${iconHeightSetting}px`;

		const iconPath_tmp = getIconPath(iconPathSetting, iconWidthWithPx, iconHeightWithPx);
		const iconsize = sizeOf(iconPath_tmp);
		const iconPath = vscode.Uri.file(iconPath_tmp);

		const lineHeight = calculateEditorLineHeight();
		const iconHeight = iconsize.height ?? defaultIconHeight;

		let topValue = iconHeight <= lineHeight
			? (iconHeight - lineHeight / 4) / 2
			: -((iconHeight - lineHeight / 4) / 2);

		topValue = topValue + adjustTopPosition;

		const defaultCss = {
			position: 'absolute',
			top: `${topValue}px`,
			['z-index']: 1,
			['pointer-events']: 'none',
		};

		const defaultCssString = objectToCssString(defaultCss);

		return vscode.window.createTextEditorDecorationType({
			after: {
				contentIconPath: iconPath,
				textDecoration: `none; ${defaultCssString}`,
				margin: '0 1rem',
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
		if (doc.languageId === 'rust') {
			diagnosticCollection.delete(doc.uri);
		}
	});

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('rustPanicHighlighter.icon.enabled') ||
			event.affectsConfiguration('rustPanicHighlighter.icon.path') ||
			event.affectsConfiguration('rustPanicHighlighter.icon.width') ||
			event.affectsConfiguration('rustPanicHighlighter.icon.height') ||
			event.affectsConfiguration('rustPanicHighlighter.icon.adjustTopPosition')) {

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

	for (let i = 0; i < doc.lineCount; i++) {
		const line = doc.lineAt(i);

		if (line.text.trimStart().startsWith("//")) {
			continue;
		}

		if (line.text.includes("panic!(") || line.text.includes("unwrap(") || line.text.includes("expect(")) {
			let diagnosticMessage = "";

			if (line.text.includes("panic!(")) {
				diagnosticMessage = "This line contains a 'panic!' which can cause a runtime panic.";
			} else if (line.text.includes("unwrap(")) {
				diagnosticMessage = "This line contains an 'unwrap()', which will panic if the result is None or Err.";
			} else if (line.text.includes("expect(")) {
				diagnosticMessage = "This line contains an 'expect()', which will panic if the result is None or Err.";
			}

			let startIndex = 0;
			if (line.text.includes("panic!(")) {
				startIndex = line.text.indexOf("panic!(");
			} else if (line.text.includes("unwrap(")) {
				startIndex = line.text.indexOf("unwrap(");
			} else if (line.text.includes("expect(")) {
				startIndex = line.text.indexOf("expect(");
			}

			const range = new vscode.Range(i, startIndex, i, line.text.length);
			rangesToDecorate.push(range);

			let diagnostic = new vscode.Diagnostic(
				range,
				diagnosticMessage,
				severity
			);
			diagnostics.push(diagnostic);
		}
	}

	if (editor) {
		if (rangesToDecorate.length > 0) {
			editor.setDecorations(decorationType, rangesToDecorate);
		} else {
			editor.setDecorations(decorationType, []);
		}
	}

	if (diagnostics.length === 0) {
		diagnosticCollection.delete(doc.uri);
	} else {
		diagnosticCollection.set(doc.uri, diagnostics);
	}
}

export function deactivate() { }
