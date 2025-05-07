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
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode4 = __toESM(require("vscode"));
var import_fs2 = __toESM(require("fs"));

// src/decoration.ts
var vscode2 = __toESM(require("vscode"));
var fs2 = __toESM(require("fs"));
var path2 = __toESM(require("path"));

// src/utils.ts
var vscode = __toESM(require("vscode"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_os = __toESM(require("os"));

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/constants.ts
var tmpFileName = "rustPanicHighlighter_icon_tmp";
var defaultIconPath = "resources/panic-icon.gif";
var defaultIconSize = 64;
var defaultAdjustTopPosition = 0;
var maxLengthLine = 105;
var MinXPositionIconValue = 115;
var supportedFormats = [".gif", ".png", ".jpg", ".jpeg", ".svg"];
var tmpFolderName = "RustPanicHighlighter";
var PanicType = /* @__PURE__ */ ((PanicType2) => {
  PanicType2["unwrap"] = "unwrap(";
  PanicType2["unwrap_unchecked"] = "unwrap_unchecked(";
  PanicType2["unwrap_err"] = "unwrap_err(";
  PanicType2["unwrap_err_unchecked"] = "unwrap_err_unchecked(";
  PanicType2["expect"] = 'expect("';
  PanicType2["panic"] = "panic!(";
  PanicType2["todo"] = "todo!(";
  PanicType2["unimplemented"] = "unimplemented!(";
  PanicType2["assert"] = "assert!(";
  PanicType2["assert_eq"] = "assert_eq!(";
  PanicType2["assert_ne"] = "assert_ne!(";
  return PanicType2;
})(PanicType || {});
var DiagnosticMessages = {
  ["unwrap(" /* unwrap */]: "This line contains an 'unwrap()', which will panic if the result is None or Err.",
  ["unwrap_unchecked(" /* unwrap_unchecked */]: "This line contains an 'unwrap_unchecked()', which can cause undefined behavior if the result is None or Err.",
  ["unwrap_err(" /* unwrap_err */]: "This line contains an 'unwrap_err()', which will panic if the result is Ok.",
  ["unwrap_err_unchecked(" /* unwrap_err_unchecked */]: "This line contains an 'unwrap_err_unchecked()', which can cause undefined behavior if the result is Ok.",
  ['expect("' /* expect */]: "This line contains an 'expect()', which will panic if the result is None or Err.",
  ["panic!(" /* panic */]: "This line contains a 'panic!' which can cause a runtime panic.",
  ["todo!(" /* todo */]: "This line contains a 'todo!' macro, which is a placeholder and will panic if executed.",
  ["unimplemented!(" /* unimplemented */]: "This line contains an 'unimplemented!' macro, which will panic if executed.",
  ["assert!(" /* assert */]: "This line contains an 'assert!()', which will panic if the condition is false.",
  ["assert_eq!(" /* assert_eq */]: "This line contains an 'assert_eq!()', which will panic if the two values are not equal.",
  ["assert_ne!(" /* assert_ne */]: "This line contains an 'assert_ne!()', which will panic if the two values are equal."
};

// src/utils.ts
function objectToCssString(settings) {
  let value = "";
  const cssString = Object.keys(settings).map((setting) => {
    value = String(settings[setting]);
    if (typeof value === "string" || typeof value === "number") {
      return `${setting}: ${value};`;
    }
  }).join(" ");
  return cssString;
}
function calculateEditorLineHeight() {
  const editorConfig = vscode.workspace.getConfiguration("editor");
  const fontSize2 = editorConfig.get("fontSize") || 14;
  const lineHeightSetting = editorConfig.get("lineHeight") || 0;
  let lineHeight;
  if (lineHeightSetting === 0) {
    lineHeight = fontSize2;
  } else if (lineHeightSetting > 0 && lineHeightSetting < 8) {
    lineHeight = fontSize2 * lineHeightSetting;
  } else {
    lineHeight = lineHeightSetting;
  }
  return lineHeight;
}
function createTempSvgPath(content) {
  const tempDir = import_os.default.tmpdir();
  const rustPanicHighlighterDir = import_path.default.join(tempDir, tmpFolderName);
  const uniqueId = v4_default();
  const tempSvgPath = import_path.default.join(rustPanicHighlighterDir, `${tmpFileName}_${uniqueId}.svg`);
  import_fs.default.writeFileSync(tempSvgPath, content, "utf8");
  return tempSvgPath;
}
function clearOrCreateDirectoryInTempDir() {
  const tempDir = import_os.default.tmpdir();
  const directoryPathInTempDir = import_path.default.join(tempDir, tmpFolderName);
  if (import_fs.default.existsSync(directoryPathInTempDir)) {
    const files = import_fs.default.readdirSync(directoryPathInTempDir);
    files.forEach((file) => {
      const filePath = import_path.default.join(directoryPathInTempDir, file);
      if (import_fs.default.lstatSync(filePath).isFile()) {
        import_fs.default.unlinkSync(filePath);
      }
    });
  } else {
    import_fs.default.mkdirSync(directoryPathInTempDir);
  }
}
function getSvgIcon(iconPathSetting, width, height) {
  const ext = import_path.default.extname(iconPathSetting).toLowerCase();
  if (!supportedFormats.includes(ext)) {
    throw new Error(`Unsupported image format: ${ext}`);
  }
  try {
    if (ext === ".svg") {
      const svgContent2 = import_fs.default.readFileSync(iconPathSetting, "utf8");
      const modifiedSvgContent = svgContent2.replace(
        /<svg([^>]*)>/,
        (_, svgAttributes) => {
          const newAttributes = svgAttributes + (/<width\s*=\s*["'].*?["']/.test(svgAttributes) ? "" : ` width="${width}"`) + (/<height\s*=\s*["'].*?["']/.test(svgAttributes) ? "" : ` height="${height}"`);
          return `<svg${newAttributes}>`;
        }
      );
      return createTempSvgPath(modifiedSvgContent);
    }
    const iconData = import_fs.default.readFileSync(iconPathSetting);
    const base64Data = iconData.toString("base64");
    let mimeType;
    switch (ext) {
      case ".gif":
        mimeType = "image/gif";
        break;
      case ".png":
        mimeType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        mimeType = "image/jpeg";
        break;
      default:
        throw new Error(`Unsupported image format: ${ext}`);
    }
    const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <image href="data:${mimeType};base64,${base64Data}" width="${width}" height="${height}"/>
            </svg>
        `;
    return createTempSvgPath(svgContent);
  } catch (error) {
    console.error("An error occurred while processing the icon:", error);
    throw new Error(`An error occurred while processing the icon: ${iconPathSetting}`);
  }
}
function getIconPath(context, iconPathSetting) {
  if (iconPathSetting === "default") {
    return context.asAbsolutePath(defaultIconPath);
  }
  return iconPathSetting;
}

// node_modules/image-size/dist/index.mjs
var decoder = new TextDecoder();
var toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
var toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
var getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
var readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
var readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
var readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
var readUInt24LE = (input, offset = 0) => {
  const view = getView(input, offset);
  return view.getUint16(0, true) + (view.getUint8(2) << 16);
};
var readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
var readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
var readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
var readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
var methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = `readUInt${bits}${endian}`;
  return methods[methodName](input, offset);
}
function readBox(input, offset) {
  if (input.length - offset < 4) return;
  const boxSize = readUInt32BE(input, offset);
  if (input.length - offset < boxSize) return;
  return {
    name: toUTF8String(input, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(input, boxName, currentOffset) {
  while (currentOffset < input.length) {
    const box = readBox(input, currentOffset);
    if (!box) break;
    if (box.name === boxName) return box;
    currentOffset += box.size > 0 ? box.size : 8;
  }
}
var BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};
var TYPE_ICON = 1;
var SIZE_HEADER = 2 + 2 + 2;
var SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize(input, imageIndex) {
  const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
var ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize2 = getImageSize(input, 0);
    if (nbImages === 1) return imageSize2;
    const images = [];
    for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) {
      images.push(getImageSize(input, imageIndex));
    }
    return {
      width: imageSize2.width,
      height: imageSize2.height,
      images
    };
  }
};
var TYPE_CURSOR = 2;
var CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};
var DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};
var gifRegexp = /^GIF8[79]a/;
var GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};
var brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // heif-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
var HEIF = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "ftyp") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand in brandMap;
  },
  calculate(input) {
    const metaBox = findBox(input, "meta", 0);
    const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
    if (!ipcoBox) {
      throw new TypeError("Invalid HEIF, no ipco box found");
    }
    const type = toUTF8String(input, 8, 12);
    const images = [];
    let currentOffset = ipcoBox.offset + 8;
    while (currentOffset < ipcoBox.offset + ipcoBox.size) {
      const ispeBox = findBox(input, "ispe", currentOffset);
      if (!ispeBox) break;
      const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
      const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
      const clapBox = findBox(input, "clap", currentOffset);
      let width = rawWidth;
      let height = rawHeight;
      if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
        const cropRight = readUInt32BE(input, clapBox.offset + 12);
        width = rawWidth - cropRight;
      }
      images.push({ height, width });
      currentOffset = ispeBox.offset + ispeBox.size;
    }
    if (images.length === 0) {
      throw new TypeError("Invalid HEIF, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      type,
      ...images.length > 1 ? { images } : {}
    };
  }
};
var SIZE_HEADER2 = 4 + 4;
var FILE_LENGTH_OFFSET = 4;
var ENTRY_LENGTH_OFFSET = 4;
var ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize2(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
var ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER2;
    const images = [];
    while (imageOffset < fileLength && imageOffset < inputLength) {
      const imageHeader = readImageHeader(input, imageOffset);
      const imageSize2 = getImageSize2(imageHeader[0]);
      images.push(imageSize2);
      imageOffset += imageHeader[1];
    }
    if (images.length === 0) {
      throw new TypeError("Invalid ICNS, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      ...images.length > 1 ? { images } : {}
    };
  }
};
var J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => readUInt32BE(input, 0) === 4283432785,
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};
var JP2 = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "jP  ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jp2 ";
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};
var EXIF_MARKER = "45786966";
var APP1_DATA_SIZE_BYTES = 2;
var EXIF_HEADER_BYTES = 6;
var TIFF_BYTE_ALIGN_BYTES = 2;
var BIG_ENDIAN_BYTE_ALIGN = "4d4d";
var LITTLE_ENDIAN_BYTE_ALIGN = "4949";
var IDF_ENTRY_BYTES = 12;
var NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
var JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(_input) {
    let input = _input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      validateInput(input, i);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};
var BitReader = class {
  constructor(input, endianness) {
    this.input = input;
    this.endianness = endianness;
    this.byteOffset = 2;
    this.bitOffset = 0;
  }
  /** Reads a specified number of bits, and move the offset */
  getBits(length = 1) {
    let result = 0;
    let bitsRead = 0;
    while (bitsRead < length) {
      if (this.byteOffset >= this.input.length) {
        throw new Error("Reached end of input");
      }
      const currentByte = this.input[this.byteOffset];
      const bitsLeft = 8 - this.bitOffset;
      const bitsToRead = Math.min(length - bitsRead, bitsLeft);
      if (this.endianness === "little-endian") {
        const mask = (1 << bitsToRead) - 1;
        const bits = currentByte >> this.bitOffset & mask;
        result |= bits << bitsRead;
      } else {
        const mask = (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead;
        const bits = (currentByte & mask) >> 8 - this.bitOffset - bitsToRead;
        result = result << bitsToRead | bits;
      }
      bitsRead += bitsToRead;
      this.bitOffset += bitsToRead;
      if (this.bitOffset === 8) {
        this.byteOffset++;
        this.bitOffset = 0;
      }
    }
    return result;
  }
};
function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) {
    return 8 * (1 + reader.getBits(5));
  }
  const sizeClass = reader.getBits(2);
  const extraBits = [9, 13, 18, 30][sizeClass];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) {
    return 8 * (1 + reader.getBits(5));
  }
  if (widthMode === 0) {
    return calculateImageDimension(reader, false);
  }
  const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
  return Math.floor(height * aspectRatios[widthMode - 1]);
}
var JXLStream = {
  validate: (input) => {
    return toHexString(input, 0, 2) === "ff0a";
  },
  calculate(input) {
    const reader = new BitReader(input, "little-endian");
    const isSmallImage = reader.getBits(1) === 1;
    const height = calculateImageDimension(reader, isSmallImage);
    const widthMode = reader.getBits(3);
    const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
    return { width, height };
  }
};
function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox) {
    return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  }
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) {
    return concatenateCodestreams(partialStreams);
  }
  return void 0;
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox) break;
    partialStreams.push(
      input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size)
    );
    offset = jxlpBox.offset + jxlpBox.size;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce(
    (acc, curr) => acc + curr.length,
    0
  );
  const codestream = new Uint8Array(totalLength);
  let position = 0;
  for (const partial of partialCodestreams) {
    codestream.set(partial, position);
    position += partial.length;
  }
  return codestream;
}
var JXL = {
  validate: (input) => {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "JXL ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jxl ";
  },
  calculate(input) {
    const codestream = extractCodestream(input);
    if (codestream) return JXLStream.calculate(codestream);
    throw new Error("No codestream found in JXL container");
  }
};
var KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};
var pngSignature = "PNG\r\n\n";
var pngImageHeaderChunkName = "IHDR";
var pngFriedChunkName = "CgBI";
var PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};
var PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
var handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: Number.parseInt(dimensions[1], 10),
        width: Number.parseInt(dimensions[0], 10)
      };
    }
    throw new TypeError("Invalid PNM");
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = Number.parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    }
    throw new TypeError("Invalid PAM");
  }
};
var PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};
var PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};
var svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
var extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
var INCH_CM = 2.54;
var units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
var unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
var SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};
var TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};
var CONSTANTS = {
  TAG: {
    WIDTH: 256,
    HEIGHT: 257,
    COMPRESSION: 259
  },
  TYPE: {
    SHORT: 3,
    LONG: 4,
    LONG8: 16
  },
  ENTRY_SIZE: {
    STANDARD: 12,
    BIG: 20
  },
  COUNT_SIZE: {
    STANDARD: 2,
    BIG: 8
  }
};
function readIFD(input, { isBigEndian, isBigTiff }) {
  const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return readUInt(input, 16, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG:
      return readUInt(input, 32, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG8: {
      const value = Number(readUInt64(input, offset, isBigEndian));
      if (value > Number.MAX_SAFE_INTEGER) {
        throw new TypeError("Value too large");
      }
      return value;
    }
    default:
      return 0;
  }
}
function nextTag(input, isBigTiff) {
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  if (input.length > entrySize) {
    return input.slice(entrySize);
  }
}
function extractTags(input, { isBigEndian, isBigTiff }) {
  const tags = {};
  let temp = input;
  while (temp?.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      const valueOffset = isBigTiff ? 12 : 8;
      tags[code] = readTagValue(temp, type, valueOffset, isBigEndian);
    }
    temp = nextTag(temp, isBigTiff);
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const version = readUInt(input, 16, 2, signature === "MM");
  return {
    isBigEndian: signature === "MM",
    isBigTiff: version === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const byteSize = readUInt(input, 16, 4, isBigEndian);
  const reserved = readUInt(input, 16, 6, isBigEndian);
  if (byteSize !== 8 || reserved !== 0) {
    throw new TypeError("Invalid BigTIFF header");
  }
}
var signatures = /* @__PURE__ */ new Set([
  "49492a00",
  // Little Endian
  "4d4d002a",
  // Big Endian
  "49492b00",
  // BigTIFF Little Endian
  "4d4d002b"
  // BigTIFF Big Endian
]);
var TIFF = {
  validate: (input) => {
    const signature = toHexString(input, 0, 4);
    return signatures.has(signature);
  },
  calculate(input) {
    const format = determineFormat(input);
    if (format.isBigTiff) {
      validateBigTIFFHeader(input, format.isBigEndian);
    }
    const ifdBuffer = readIFD(input, format);
    const tags = extractTags(ifdBuffer, format);
    const info = {
      height: tags[CONSTANTS.TAG.HEIGHT],
      width: tags[CONSTANTS.TAG.WIDTH],
      type: format.isBigTiff ? "bigtiff" : "tiff"
    };
    if (tags[CONSTANTS.TAG.COMPRESSION]) {
      info.compression = tags[CONSTANTS.TAG.COMPRESSION];
    }
    if (!info.width || !info.height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return info;
  }
};
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
var WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(_input) {
    const chunkHeader = toUTF8String(_input, 12, 16);
    const input = _input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      }
      throw new TypeError("Invalid WebP");
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};
var typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["jxl", JXL],
  ["jxl-stream", JXLStream],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
var types = Array.from(typeHandlers.keys());
var firstBytes = /* @__PURE__ */ new Map([
  [0, "heif"],
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((type2) => typeHandlers.get(type2).validate(input));
}
var globalOptions = {
  disabledTypes: []
};
function imageSize(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError(`disabled file type: ${type}`);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      if (size.images && size.images.length > 1) {
        const largestImage = size.images.reduce((largest, current) => {
          return current.width * current.height > largest.width * largest.height ? current : largest;
        }, size.images[0]);
        size.width = largestImage.width;
        size.height = largestImage.height;
      }
      return size;
    }
  }
  throw new TypeError(`unsupported file type: ${type}`);
}

// src/decoration.ts
function createDecorationType(context, imgPath) {
  const isEnabled = vscode2.workspace.getConfiguration().get("rustPanicHighlighter.icon.enabled") ?? true;
  if (!isEnabled) {
    return vscode2.window.createTextEditorDecorationType({});
  }
  if (imgPath === "default") {
    imgPath = context.asAbsolutePath(defaultIconPath);
  }
  const iconSize = vscode2.workspace.getConfiguration().get("rustPanicHighlighter.icon.size") || defaultIconSize;
  const adjustTopPosition = vscode2.workspace.getConfiguration().get("rustPanicHighlighter.icon.adjustTopPosition") || defaultAdjustTopPosition;
  if (iconSize !== void 0 && iconSize <= 0) {
    throw new Error("icon.size must be a positive number.");
  }
  const iconWidthWithPx = `${iconSize}px`;
  const iconHeightWithPx = `${iconSize}px`;
  const iconPath_tmp = getSvgIcon(imgPath, iconWidthWithPx, iconHeightWithPx);
  const iconBuffer = fs2.readFileSync(iconPath_tmp);
  const iconsize = imageSize(iconBuffer);
  const iconPath = vscode2.Uri.file(iconPath_tmp);
  const lineHeight = calculateEditorLineHeight();
  const iconHeight = iconsize.height ?? defaultIconSize;
  let topValue = iconHeight <= lineHeight ? (iconHeight - lineHeight / 4) / 2 : -((iconHeight - lineHeight / 4) / 2);
  topValue = topValue + adjustTopPosition;
  const defaultCss = {
    position: "absolute",
    top: `${topValue}px`,
    // left: '1000px',
    ["z-index"]: 1,
    ["pointer-events"]: "none"
  };
  const defaultCssString = objectToCssString(defaultCss);
  return vscode2.window.createTextEditorDecorationType({
    after: {
      contentIconPath: iconPath,
      textDecoration: `none; ${defaultCssString}`,
      margin: "0 1rem"
    }
  });
}
function createDecorationTypes(context, imgPath) {
  const isEnabled = vscode2.workspace.getConfiguration().get("rustPanicHighlighter.icon.enabled") ?? true;
  if (!isEnabled) {
    return [];
  }
  if (imgPath === "default") {
    imgPath = context.asAbsolutePath(defaultIconPath);
  }
  const iconSize = vscode2.workspace.getConfiguration().get("rustPanicHighlighter.icon.size") || defaultIconSize;
  const adjustTopPosition = vscode2.workspace.getConfiguration().get("rustPanicHighlighter.icon.adjustTopPosition") || defaultAdjustTopPosition;
  if (iconSize <= 0) {
    throw new Error("icon.size must be a positive number.");
  }
  const iconWidthWithPx = `${iconSize}px`;
  const iconHeightWithPx = `${iconSize}px`;
  const iconFolderPath = path2.resolve(context.extensionPath, imgPath);
  const iconFiles = fs2.readdirSync(iconFolderPath);
  const decorationTypes = [];
  for (const iconFile of iconFiles) {
    let iconPath_tmp;
    try {
      iconPath_tmp = getSvgIcon(path2.join(iconFolderPath, iconFile), iconWidthWithPx, iconHeightWithPx);
    } catch (error) {
      console.error(`Error while creating decoration type for icon: ${iconFile}, error : ${error}`);
      continue;
    }
    if (!iconPath_tmp) {
      continue;
    }
    const iconPath = vscode2.Uri.file(iconPath_tmp);
    const iconBuffer = fs2.readFileSync(iconPath_tmp);
    const iconSize2 = imageSize(iconBuffer);
    const lineHeight = calculateEditorLineHeight();
    const iconHeight = iconSize2.height ?? defaultIconSize;
    let topValue = iconHeight <= lineHeight ? (iconHeight - lineHeight / 4) / 2 : -((iconHeight - lineHeight / 4) / 2);
    topValue = topValue + adjustTopPosition;
    const defaultCss = {
      position: "absolute",
      top: `${topValue}px`,
      ["z-index"]: 1,
      ["pointer-events"]: "none"
    };
    const defaultCssString = objectToCssString(defaultCss);
    const decorationType = vscode2.window.createTextEditorDecorationType({
      after: {
        contentIconPath: iconPath,
        textDecoration: `none; ${defaultCssString}`,
        margin: "0 1rem"
      }
    });
    decorationTypes.push(decorationType);
  }
  return decorationTypes;
}

// src/diagnostics.ts
var vscode3 = __toESM(require("vscode"));
var fontSize = calculateEditorLineHeight();
var charWidth = fontSize * 0.5;
var leftPosition = MinXPositionIconValue * charWidth;
var addCss = {
  position: "absolute",
  ["z-index"]: 1,
  left: `${leftPosition}px`
};
var addCssString = objectToCssString(addCss);
function updateDiagnostics(doc, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock) {
  if (doc.languageId !== "rust") {
    return;
  }
  const diagnostics = [];
  const editor = vscode3.window.activeTextEditor;
  const rangesToDecorate = [];
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
    let foundType = null;
    for (const [key, value] of Object.entries(PanicType)) {
      if (!ignoredPanics.includes(key.toLowerCase()) && line.text.includes(value)) {
        foundType = value;
        break;
      }
    }
    if (foundType) {
      const diagnosticMessage = DiagnosticMessages[foundType];
      const startIndex = line.text.indexOf(foundType);
      const range = new vscode3.Range(i, startIndex, i, line.text.length);
      rangesToDecorate.push(range);
      const diagnostic = new vscode3.Diagnostic(
        range,
        diagnosticMessage,
        severity
      );
      diagnostics.push(diagnostic);
    }
  }
  applyDecorationsAndDiagnostics(editor, rangesToDecorate, addCssString, minXPositionEnabled, decorationTypes, diagnostics, diagnosticCollection, doc);
}
function applyDecorationsAndDiagnostics(editor, rangesToDecorate, addCssString2, minXPositionEnabled, decorationTypes, diagnostics, diagnosticCollection, doc) {
  if (editor) {
    decorationTypes.forEach((decorationType) => {
      editor.setDecorations(decorationType, []);
    });
    const randomDecorationType = decorationTypes[Math.floor(Math.random() * decorationTypes.length)];
    if (minXPositionEnabled) {
      const decorationOptions = rangesToDecorate.map((range) => {
        const cssToApply = range.end.character >= maxLengthLine ? "" : addCssString2;
        return {
          range,
          renderOptions: {
            after: {
              textDecoration: cssToApply
            }
          }
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
function handleTestBlock(line, inTestBlock, braceCount) {
  if (line.text.includes("#[test]")) {
    inTestBlock = true;
    braceCount = 0;
    return { inTestBlock, braceCount, shouldContinue: true };
  }
  if (inTestBlock) {
    for (const char of line.text) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          inTestBlock = false;
        }
      }
    }
  }
  return { inTestBlock, braceCount, shouldContinue: inTestBlock };
}
function getSeverityLevel() {
  const severitySetting = vscode3.workspace.getConfiguration().get("rustPanicHighlighter.diagnostic.severity");
  let severity;
  switch (severitySetting) {
    case "Error":
      severity = vscode3.DiagnosticSeverity.Error;
      break;
    case "Information":
      severity = vscode3.DiagnosticSeverity.Information;
      break;
    case "Hint":
      severity = vscode3.DiagnosticSeverity.Hint;
      break;
    case "Warning":
    default:
      severity = vscode3.DiagnosticSeverity.Warning;
      break;
  }
  return severity;
}

// src/extension.ts
function activate(context) {
  clearOrCreateDirectoryInTempDir();
  const diagnosticCollection = vscode4.languages.createDiagnosticCollection("rust-panic-highlighter");
  context.subscriptions.push(diagnosticCollection);
  let imgPathSetting = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.icon.path") || "default";
  let imgPath = getIconPath(context, imgPathSetting);
  let decorationTypes = [];
  if (import_fs2.default.lstatSync(imgPath).isDirectory()) {
    decorationTypes = createDecorationTypes(context, imgPath);
  } else {
    decorationTypes = [createDecorationType(context, imgPath)];
  }
  decorationTypes.forEach((decorationType) => {
    context.subscriptions.push(decorationType);
  });
  let severity = getSeverityLevel();
  let ignoreInTestBlock = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.diagnostic.ignoreInTestBlock", true);
  let ignoredPanics = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.diagnostic.ignoredPanics", []);
  let minXPositionEnabled = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.icon.minXPositionEnabled", true);
  vscode4.workspace.textDocuments.forEach((doc) => {
    if (doc.languageId === "rust") {
      updateDiagnostics(doc, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
    }
  });
  vscode4.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === "rust") {
      updateDiagnostics(event.document, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
    }
  });
  vscode4.workspace.onDidCloseTextDocument((doc) => {
    if (doc.languageId === "rust") {
      diagnosticCollection.delete(doc.uri);
    }
  });
  vscode4.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && editor.document.languageId === "rust") {
      updateDiagnostics(editor.document, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
    }
  });
  vscode4.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("rustPanicHighlighter")) {
      clearOrCreateDirectoryInTempDir();
      decorationTypes.forEach((decorationType) => {
        decorationType.dispose();
      });
      imgPathSetting = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.icon.path") || "default";
      imgPath = getIconPath(context, imgPathSetting);
      if (import_fs2.default.lstatSync(imgPath).isDirectory()) {
        decorationTypes = createDecorationTypes(context, imgPath);
      } else {
        decorationTypes = [createDecorationType(context, imgPath)];
      }
      decorationTypes.forEach((decorationType) => {
        context.subscriptions.push(decorationType);
      });
      severity = getSeverityLevel();
      ignoreInTestBlock = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.diagnostic.ignoreInTestBlock", true);
      ignoredPanics = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.diagnostic.ignoredPanics", []);
      minXPositionEnabled = vscode4.workspace.getConfiguration().get("rustPanicHighlighter.icon.minXPositionEnabled", true);
      vscode4.workspace.textDocuments.forEach((doc) => {
        if (doc.languageId === "rust") {
          updateDiagnostics(doc, diagnosticCollection, decorationTypes, severity, ignoredPanics, minXPositionEnabled, ignoreInTestBlock);
        }
      });
    }
  });
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
