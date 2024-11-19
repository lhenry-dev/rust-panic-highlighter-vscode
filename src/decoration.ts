import * as vscode from 'vscode';
import { getIconPath } from './utils';
import { defaultIconPath, defaultIconSize, defaultAdjustTopPosition } from './constants';
import { calculateEditorLineHeight, objectToCssString } from './utils';
import sizeOf from "image-size";

export function createDecorationType(context: vscode.ExtensionContext): vscode.TextEditorDecorationType {
    const isEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.enabled') ?? true;

    if (!isEnabled) {
        return vscode.window.createTextEditorDecorationType({});
    }

    let iconPathSetting = vscode.workspace.getConfiguration().get<string>('rustPanicHighlighter.icon.path') || 'default';

    if (iconPathSetting === "default") {
        iconPathSetting = context.asAbsolutePath(defaultIconPath);
    }

    const iconSize = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.size') || defaultIconSize;
    const adjustTopPosition = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.adjustTopPosition') || defaultAdjustTopPosition;

    if (iconSize !== undefined && iconSize <= 0) {
        throw new Error("icon.size must be a positive number.");
    }

    const iconWidthWithPx = `${iconSize}px`;
    const iconHeightWithPx = `${iconSize}px`;

    const iconPath_tmp = getIconPath(iconPathSetting, iconWidthWithPx, iconHeightWithPx);
    const iconsize = sizeOf(iconPath_tmp);
    const iconPath = vscode.Uri.file(iconPath_tmp);

    const lineHeight = calculateEditorLineHeight();
    const iconHeight = iconsize.height ?? defaultIconSize;

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
