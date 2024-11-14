import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
const os = require('os');
const sizeOf = require("image-size")

export const defaultIconPath = 'resources/panic-icon.gif';
// export const defaultIconPath = 'resources/broken.svg';
export const defaultIconWidth = '14px';
export const defaultIconHeight = '14px';

function objectToCssString(settings: any): string {
	let value = '';
	const cssString = Object.keys(settings).map(setting => {
		value = settings[setting];
		if (typeof value === 'string' || typeof value === 'number') {
			return `${setting}: ${value};`
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
	const supportedFormats = ['.gif', '.png', '.jpg', '.jpeg'];

	if (supportedFormats.includes(ext)) {
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
				throw new Error(`Format d'image non pris en charge : ${ext}`);
		}

		const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <image href="data:${mimeType};base64,${base64Data}" width="${width}" height="${height}"/>
            </svg>
        `;

		const tempDir = os.tmpdir();
		const tempSvgPath = path.join(tempDir, `icon_tmp.svg`);

		fs.writeFileSync(tempSvgPath, svgContent, 'utf8');

		// return vscode.Uri.file(tempSvgPath);
		return tempSvgPath;
	}

	// Si le format n'est pas pris en charge, renvoyer le chemin original
	// return vscode.Uri.file(iconPathSetting);
	return iconPathSetting;
};

export function activate(context: vscode.ExtensionContext) {
	let diagnosticCollection = vscode.languages.createDiagnosticCollection('rust-panic-highlighter');
	context.subscriptions.push(diagnosticCollection);

	function createDecorationType(): vscode.TextEditorDecorationType {
		const isEnabled = vscode.workspace.getConfiguration().get<boolean>('icon.enabled') ?? true;

		if (!isEnabled) {
			return vscode.window.createTextEditorDecorationType({});
		}

		let iconPathSetting = vscode.workspace.getConfiguration().get<string>('icon.path') || 'default';

		if (iconPathSetting === "default") {
			iconPathSetting = context.asAbsolutePath(defaultIconPath);
		}

		const iconWidthSetting = vscode.workspace.getConfiguration().get<string>('icon.width') || defaultIconWidth;
		const iconHeightSetting = vscode.workspace.getConfiguration().get<string>('icon.height') || defaultIconHeight;
		// const iconPath = getIconPath(iconPathSetting, iconWidthSetting, iconHeightSetting);
		// const iconPath = vscode.Uri.file(iconPathSetting);

		const iconPath_tmp = getIconPath(iconPathSetting, iconWidthSetting, iconHeightSetting);
		const iconsize = sizeOf(iconPath_tmp);
		const iconPath = vscode.Uri.file(iconPath_tmp);

		const lineHeight = calculateEditorLineHeight();
		const iconHeight = iconsize.height;

		console.log(`iconHeight: ${iconsize.height}`);
		console.log(`lineWidth: ${iconsize.width}`);

		const topValue = iconHeight <= lineHeight
			? (lineHeight - iconHeight) / 2
			: -(iconHeight - lineHeight) / 2;

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
				// width: iconWidthSetting,
				// height: iconHeightSetting,
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
		if (event.affectsConfiguration('icon.enabled') ||
			event.affectsConfiguration('icon.path') ||
			event.affectsConfiguration('icon.width') ||
			event.affectsConfiguration('icon.height')) {

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

	const severitySetting = vscode.workspace.getConfiguration().get<string>('diagnostic.severity');
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

		if (line.text.includes("panic!(") || line.text.includes("unwrap()") || line.text.includes("expect(")) {
			let diagnosticMessage = "";

			if (line.text.includes("panic!(")) {
				diagnosticMessage = "This line contains a 'panic!' which can cause a runtime panic.";
			} else if (line.text.includes("unwrap()")) {
				diagnosticMessage = "This line contains an 'unwrap()', which will panic if the result is None or Err.";
			} else if (line.text.includes("expect(")) {
				diagnosticMessage = "This line contains an 'expect()', which will panic if the result is None or Err.";
			}

			let startIndex = 0;
			if (line.text.includes("panic!(")) {
				startIndex = line.text.indexOf("panic!(");
			} else if (line.text.includes("unwrap()")) {
				startIndex = line.text.indexOf("unwrap()");
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
