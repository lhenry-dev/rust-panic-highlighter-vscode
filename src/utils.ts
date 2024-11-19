import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { tmpFileName } from './constants';

export function objectToCssString(settings: any): string {
    let value = '';
    const cssString = Object.keys(settings).map(setting => {
        value = settings[setting];
        if (typeof value === 'string' || typeof value === 'number') {
            return `${setting}: ${value};`;
        }
    }).join(' ');

    return cssString;
}

export function calculateEditorLineHeight(): number {
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

const supportedFormats = ['.gif', '.png', '.jpg', '.jpeg', '.svg'];

const createTempSvgPath = (content: string): string => {
    const tempDir = os.tmpdir();
    const uniqueId = uuidv4();
    const tempSvgPath = path.join(tempDir, `tmpFile_${uniqueId}.svg`);
    fs.writeFileSync(tempSvgPath, content, 'utf8');
    return tempSvgPath;
};

export const getIconPath = (iconPathSetting: string, width: string, height: string) => {
    const ext = path.extname(iconPathSetting).toLowerCase();

    if (!supportedFormats.includes(ext)) {
        throw new Error(`Unsupported image format: ${ext}`);
    }

    try {
        if (ext === '.svg') {
            // Process SVG file
            const svgContent = fs.readFileSync(iconPathSetting, 'utf8');
            const modifiedSvgContent = svgContent.replace(
                /<svg([^>]*)>/,
                (_: string, svgAttributes: string) => {
                    const newAttributes = svgAttributes
                        + (/<width\s*=\s*["'].*?["']/.test(svgAttributes) ? '' : ` width="${width}"`)
                        + (/<height\s*=\s*["'].*?["']/.test(svgAttributes) ? '' : ` height="${height}"`);

                    return `<svg${newAttributes}>`;
                }
            );
            return createTempSvgPath(modifiedSvgContent);
        }

        // Process image formats (.gif, .png, .jpg, .jpeg)
        const iconData = fs.readFileSync(iconPathSetting);
        const base64Data = iconData.toString('base64');

        let mimeType: string;
        switch (ext) {
            case '.gif': mimeType = 'image/gif'; break;
            case '.png': mimeType = 'image/png'; break;
            case '.jpg':
            case '.jpeg': mimeType = 'image/jpeg'; break;
            default: throw new Error(`Unsupported image format: ${ext}`);
        }

        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <image href="data:${mimeType};base64,${base64Data}" width="${width}" height="${height}"/>
            </svg>
        `;

        return createTempSvgPath(svgContent);

    } catch (error) {
        console.error('An error occurred while processing the icon:', error);
        throw new Error(`An error occurred while processing the icon: ${iconPathSetting}`);
    }
};
