import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getSvgIcon } from './utils';
import { defaultIconPath, defaultIconSize, defaultAdjustTopPosition } from './constants';
import { calculateEditorLineHeight, objectToCssString } from './utils';
import sizeOf from "image-size";

export function createDecorationType(context: vscode.ExtensionContext, imgPath: string): vscode.TextEditorDecorationType {
    const isEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.enabled') ?? true;

    if (!isEnabled) {
        return vscode.window.createTextEditorDecorationType({});
    }

    if (imgPath === "default") {
        imgPath = context.asAbsolutePath(defaultIconPath);
    }

    const iconSize = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.size') || defaultIconSize;
    const adjustTopPosition = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.adjustTopPosition') || defaultAdjustTopPosition;

    if (iconSize !== undefined && iconSize <= 0) {
        throw new Error("icon.size must be a positive number.");
    }

    const iconWidthWithPx = `${iconSize}px`;
    const iconHeightWithPx = `${iconSize}px`;

    const iconPath_tmp = getSvgIcon(imgPath, iconWidthWithPx, iconHeightWithPx);
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
        // left: '1000px',
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

export function createDecorationTypes(context: vscode.ExtensionContext, imgPath: string): vscode.TextEditorDecorationType[] {
    const isEnabled = vscode.workspace.getConfiguration().get<boolean>('rustPanicHighlighter.icon.enabled') ?? true;

    if (!isEnabled) {
        return [];
    }

    if (imgPath === "default") {
        imgPath = context.asAbsolutePath(defaultIconPath);
    }

    const iconSize = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.size') || defaultIconSize;
    const adjustTopPosition = vscode.workspace.getConfiguration().get<number>('rustPanicHighlighter.icon.adjustTopPosition') || defaultAdjustTopPosition;

    if (iconSize <= 0) {
        throw new Error("icon.size must be a positive number.");
    }

    const iconWidthWithPx = `${iconSize}px`;
    const iconHeightWithPx = `${iconSize}px`;

    const iconFolderPath = path.resolve(context.extensionPath, imgPath);
    const iconFiles = fs.readdirSync(iconFolderPath);

    const decorationTypes: vscode.TextEditorDecorationType[] = [];

    for (const iconFile of iconFiles) {
        let iconPath_tmp: string | undefined;

        try {
            iconPath_tmp = getSvgIcon(path.join(iconFolderPath, iconFile), iconWidthWithPx, iconHeightWithPx);
        } catch (error) {
            console.error(`Error while creating decoration type for icon: ${iconFile}`);
            continue;
        }

        if (!iconPath_tmp) {
            continue;
        }

        const iconPath = vscode.Uri.file(iconPath_tmp);

        const iconSize = sizeOf(iconPath_tmp);

        const lineHeight = calculateEditorLineHeight();
        const iconHeight = iconSize.height ?? defaultIconSize;

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

        const decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentIconPath: iconPath,
                textDecoration: `none; ${defaultCssString}`,
                margin: '0 1rem',
            },
        });

        decorationTypes.push(decorationType);
    }

    return decorationTypes;
}
