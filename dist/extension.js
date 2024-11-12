"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate,
  defaultIconHeight: () => defaultIconHeight,
  defaultIconPath: () => defaultIconPath,
  defaultIconWidth: () => defaultIconWidth
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var defaultIconPath = "resources/broken.svg";
var defaultIconWidth = "14px";
var defaultIconHeight = "14px";
function activate(context) {
  let diagnosticCollection = vscode.languages.createDiagnosticCollection("rust-panic-highlighter");
  context.subscriptions.push(diagnosticCollection);
  function createDecorationType() {
    let iconPathSetting = vscode.workspace.getConfiguration().get("rustPanicHighlighter.iconPath") || "";
    if (!iconPathSetting.endsWith(".svg")) {
      vscode.window.showWarningMessage("Invalid icon path: Only SVG files are supported. Using default icon.");
      iconPathSetting = context.asAbsolutePath(defaultIconPath);
    }
    const iconPath = vscode.Uri.file(iconPathSetting);
    const iconWidthSetting = vscode.workspace.getConfiguration().get("rustPanicHighlighter.iconWidth") || defaultIconWidth;
    const iconHeightSetting = vscode.workspace.getConfiguration().get("rustPanicHighlighter.iconHeight") || defaultIconHeight;
    return vscode.window.createTextEditorDecorationType({
      after: {
        contentIconPath: iconPath,
        width: iconWidthSetting,
        height: iconHeightSetting,
        margin: "0 10px"
      }
    });
  }
  let decorationType = createDecorationType();
  context.subscriptions.push(decorationType);
  vscode.workspace.onDidOpenTextDocument((doc) => {
    if (doc.languageId === "rust") {
      updateDiagnostics(doc, diagnosticCollection, decorationType);
    }
  });
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === "rust") {
      updateDiagnostics(event.document, diagnosticCollection, decorationType);
    }
  });
  vscode.workspace.onDidCloseTextDocument((doc) => {
    diagnosticCollection.delete(doc.uri);
  });
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("rustPanicHighlighter.iconPath") || event.affectsConfiguration("rustPanicHighlighter.iconWidth") || event.affectsConfiguration("rustPanicHighlighter.iconHeight")) {
      decorationType.dispose();
      decorationType = createDecorationType();
      context.subscriptions.push(decorationType);
      vscode.workspace.textDocuments.forEach((doc) => {
        if (doc.languageId === "rust") {
          updateDiagnostics(doc, diagnosticCollection, decorationType);
        }
      });
    }
  });
}
function updateDiagnostics(doc, diagnosticCollection, decorationType) {
  let diagnostics = [];
  let editor = vscode.window.activeTextEditor;
  let rangesToDecorate = [];
  const severitySetting = vscode.workspace.getConfiguration().get("rustPanicHighlighter.diagnosticSeverity");
  let severity;
  switch (severitySetting) {
    case "Error":
      severity = vscode.DiagnosticSeverity.Error;
      break;
    case "Information":
      severity = vscode.DiagnosticSeverity.Information;
      break;
    case "Hint":
      severity = vscode.DiagnosticSeverity.Hint;
      break;
    case "Warning":
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
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate,
  defaultIconHeight,
  defaultIconPath,
  defaultIconWidth
});
//# sourceMappingURL=extension.js.map
