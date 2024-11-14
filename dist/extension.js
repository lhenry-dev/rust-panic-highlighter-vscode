"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function") throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/queue/index.js
var require_queue = __commonJS({
  "node_modules/queue/index.js"(exports2, module2) {
    var inherits = require_inherits();
    var EventEmitter = require("events").EventEmitter;
    module2.exports = Queue;
    module2.exports.default = Queue;
    function Queue(options) {
      if (!(this instanceof Queue)) {
        return new Queue(options);
      }
      EventEmitter.call(this);
      options = options || {};
      this.concurrency = options.concurrency || Infinity;
      this.timeout = options.timeout || 0;
      this.autostart = options.autostart || false;
      this.results = options.results || null;
      this.pending = 0;
      this.session = 0;
      this.running = false;
      this.jobs = [];
      this.timers = {};
    }
    inherits(Queue, EventEmitter);
    var arrayMethods = [
      "pop",
      "shift",
      "indexOf",
      "lastIndexOf"
    ];
    arrayMethods.forEach(function(method) {
      Queue.prototype[method] = function() {
        return Array.prototype[method].apply(this.jobs, arguments);
      };
    });
    Queue.prototype.slice = function(begin, end) {
      this.jobs = this.jobs.slice(begin, end);
      return this;
    };
    Queue.prototype.reverse = function() {
      this.jobs.reverse();
      return this;
    };
    var arrayAddMethods = [
      "push",
      "unshift",
      "splice"
    ];
    arrayAddMethods.forEach(function(method) {
      Queue.prototype[method] = function() {
        var methodResult = Array.prototype[method].apply(this.jobs, arguments);
        if (this.autostart) {
          this.start();
        }
        return methodResult;
      };
    });
    Object.defineProperty(Queue.prototype, "length", {
      get: function() {
        return this.pending + this.jobs.length;
      }
    });
    Queue.prototype.start = function(cb) {
      if (cb) {
        callOnErrorOrEnd.call(this, cb);
      }
      this.running = true;
      if (this.pending >= this.concurrency) {
        return;
      }
      if (this.jobs.length === 0) {
        if (this.pending === 0) {
          done.call(this);
        }
        return;
      }
      var self = this;
      var job = this.jobs.shift();
      var once = true;
      var session = this.session;
      var timeoutId = null;
      var didTimeout = false;
      var resultIndex = null;
      var timeout = job.hasOwnProperty("timeout") ? job.timeout : this.timeout;
      function next(err, result) {
        if (once && self.session === session) {
          once = false;
          self.pending--;
          if (timeoutId !== null) {
            delete self.timers[timeoutId];
            clearTimeout(timeoutId);
          }
          if (err) {
            self.emit("error", err, job);
          } else if (didTimeout === false) {
            if (resultIndex !== null) {
              self.results[resultIndex] = Array.prototype.slice.call(arguments, 1);
            }
            self.emit("success", result, job);
          }
          if (self.session === session) {
            if (self.pending === 0 && self.jobs.length === 0) {
              done.call(self);
            } else if (self.running) {
              self.start();
            }
          }
        }
      }
      if (timeout) {
        timeoutId = setTimeout(function() {
          didTimeout = true;
          if (self.listeners("timeout").length > 0) {
            self.emit("timeout", next, job);
          } else {
            next();
          }
        }, timeout);
        this.timers[timeoutId] = timeoutId;
      }
      if (this.results) {
        resultIndex = this.results.length;
        this.results[resultIndex] = null;
      }
      this.pending++;
      self.emit("start", job);
      var promise = job(next);
      if (promise && promise.then && typeof promise.then === "function") {
        promise.then(function(result) {
          return next(null, result);
        }).catch(function(err) {
          return next(err || true);
        });
      }
      if (this.running && this.jobs.length > 0) {
        this.start();
      }
    };
    Queue.prototype.stop = function() {
      this.running = false;
    };
    Queue.prototype.end = function(err) {
      clearTimers.call(this);
      this.jobs.length = 0;
      this.pending = 0;
      done.call(this, err);
    };
    function clearTimers() {
      for (var key in this.timers) {
        var timeoutId = this.timers[key];
        delete this.timers[key];
        clearTimeout(timeoutId);
      }
    }
    function callOnErrorOrEnd(cb) {
      var self = this;
      this.on("error", onerror);
      this.on("end", onend);
      function onerror(err) {
        self.end(err);
      }
      function onend(err) {
        self.removeListener("error", onerror);
        self.removeListener("end", onend);
        cb(err, this.results);
      }
    }
    function done(err) {
      this.session++;
      this.running = false;
      this.emit("end", err);
    }
  }
});

// node_modules/image-size/dist/types/utils.js
var require_utils = __commonJS({
  "node_modules/image-size/dist/types/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.findBox = exports2.readUInt = exports2.readUInt32LE = exports2.readUInt32BE = exports2.readInt32LE = exports2.readUInt24LE = exports2.readUInt16LE = exports2.readUInt16BE = exports2.readInt16LE = exports2.toHexString = exports2.toUTF8String = void 0;
    var decoder = new TextDecoder();
    var toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
    exports2.toUTF8String = toUTF8String;
    var toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "");
    exports2.toHexString = toHexString;
    var readInt16LE = (input, offset = 0) => {
      const val = input[offset] + input[offset + 1] * 2 ** 8;
      return val | (val & 2 ** 15) * 131070;
    };
    exports2.readInt16LE = readInt16LE;
    var readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
    exports2.readUInt16BE = readUInt16BE;
    var readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
    exports2.readUInt16LE = readUInt16LE;
    var readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
    exports2.readUInt24LE = readUInt24LE;
    var readInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
    exports2.readInt32LE = readInt32LE;
    var readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
    exports2.readUInt32BE = readUInt32BE;
    var readUInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
    exports2.readUInt32LE = readUInt32LE;
    var methods = {
      readUInt16BE: exports2.readUInt16BE,
      readUInt16LE: exports2.readUInt16LE,
      readUInt32BE: exports2.readUInt32BE,
      readUInt32LE: exports2.readUInt32LE
    };
    function readUInt(input, bits, offset, isBigEndian) {
      offset = offset || 0;
      const endian = isBigEndian ? "BE" : "LE";
      const methodName = "readUInt" + bits + endian;
      return methods[methodName](input, offset);
    }
    exports2.readUInt = readUInt;
    function readBox(buffer, offset) {
      if (buffer.length - offset < 4)
        return;
      const boxSize = (0, exports2.readUInt32BE)(buffer, offset);
      if (buffer.length - offset < boxSize)
        return;
      return {
        name: (0, exports2.toUTF8String)(buffer, 4 + offset, 8 + offset),
        offset,
        size: boxSize
      };
    }
    function findBox(buffer, boxName, offset) {
      while (offset < buffer.length) {
        const box = readBox(buffer, offset);
        if (!box)
          break;
        if (box.name === boxName)
          return box;
        offset += box.size;
      }
    }
    exports2.findBox = findBox;
  }
});

// node_modules/image-size/dist/types/bmp.js
var require_bmp = __commonJS({
  "node_modules/image-size/dist/types/bmp.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BMP = void 0;
    var utils_1 = require_utils();
    exports2.BMP = {
      validate: (input) => (0, utils_1.toUTF8String)(input, 0, 2) === "BM",
      calculate: (input) => ({
        height: Math.abs((0, utils_1.readInt32LE)(input, 22)),
        width: (0, utils_1.readUInt32LE)(input, 18)
      })
    };
  }
});

// node_modules/image-size/dist/types/ico.js
var require_ico = __commonJS({
  "node_modules/image-size/dist/types/ico.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ICO = void 0;
    var utils_1 = require_utils();
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
    exports2.ICO = {
      validate(input) {
        const reserved = (0, utils_1.readUInt16LE)(input, 0);
        const imageCount = (0, utils_1.readUInt16LE)(input, 4);
        if (reserved !== 0 || imageCount === 0)
          return false;
        const imageType = (0, utils_1.readUInt16LE)(input, 2);
        return imageType === TYPE_ICON;
      },
      calculate(input) {
        const nbImages = (0, utils_1.readUInt16LE)(input, 4);
        const imageSize = getImageSize(input, 0);
        if (nbImages === 1)
          return imageSize;
        const imgs = [imageSize];
        for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
          imgs.push(getImageSize(input, imageIndex));
        }
        return {
          height: imageSize.height,
          images: imgs,
          width: imageSize.width
        };
      }
    };
  }
});

// node_modules/image-size/dist/types/cur.js
var require_cur = __commonJS({
  "node_modules/image-size/dist/types/cur.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CUR = void 0;
    var ico_1 = require_ico();
    var utils_1 = require_utils();
    var TYPE_CURSOR = 2;
    exports2.CUR = {
      validate(input) {
        const reserved = (0, utils_1.readUInt16LE)(input, 0);
        const imageCount = (0, utils_1.readUInt16LE)(input, 4);
        if (reserved !== 0 || imageCount === 0)
          return false;
        const imageType = (0, utils_1.readUInt16LE)(input, 2);
        return imageType === TYPE_CURSOR;
      },
      calculate: (input) => ico_1.ICO.calculate(input)
    };
  }
});

// node_modules/image-size/dist/types/dds.js
var require_dds = __commonJS({
  "node_modules/image-size/dist/types/dds.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DDS = void 0;
    var utils_1 = require_utils();
    exports2.DDS = {
      validate: (input) => (0, utils_1.readUInt32LE)(input, 0) === 542327876,
      calculate: (input) => ({
        height: (0, utils_1.readUInt32LE)(input, 12),
        width: (0, utils_1.readUInt32LE)(input, 16)
      })
    };
  }
});

// node_modules/image-size/dist/types/gif.js
var require_gif = __commonJS({
  "node_modules/image-size/dist/types/gif.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GIF = void 0;
    var utils_1 = require_utils();
    var gifRegexp = /^GIF8[79]a/;
    exports2.GIF = {
      validate: (input) => gifRegexp.test((0, utils_1.toUTF8String)(input, 0, 6)),
      calculate: (input) => ({
        height: (0, utils_1.readUInt16LE)(input, 8),
        width: (0, utils_1.readUInt16LE)(input, 6)
      })
    };
  }
});

// node_modules/image-size/dist/types/heif.js
var require_heif = __commonJS({
  "node_modules/image-size/dist/types/heif.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HEIF = void 0;
    var utils_1 = require_utils();
    var brandMap = {
      avif: "avif",
      mif1: "heif",
      msf1: "heif",
      // hief-sequence
      heic: "heic",
      heix: "heic",
      hevc: "heic",
      // heic-sequence
      hevx: "heic"
      // heic-sequence
    };
    exports2.HEIF = {
      validate(buffer) {
        const ftype = (0, utils_1.toUTF8String)(buffer, 4, 8);
        const brand = (0, utils_1.toUTF8String)(buffer, 8, 12);
        return "ftyp" === ftype && brand in brandMap;
      },
      calculate(buffer) {
        const metaBox = (0, utils_1.findBox)(buffer, "meta", 0);
        const iprpBox = metaBox && (0, utils_1.findBox)(buffer, "iprp", metaBox.offset + 12);
        const ipcoBox = iprpBox && (0, utils_1.findBox)(buffer, "ipco", iprpBox.offset + 8);
        const ispeBox = ipcoBox && (0, utils_1.findBox)(buffer, "ispe", ipcoBox.offset + 8);
        if (ispeBox) {
          return {
            height: (0, utils_1.readUInt32BE)(buffer, ispeBox.offset + 16),
            width: (0, utils_1.readUInt32BE)(buffer, ispeBox.offset + 12),
            type: (0, utils_1.toUTF8String)(buffer, 8, 12)
          };
        }
        throw new TypeError("Invalid HEIF, no size found");
      }
    };
  }
});

// node_modules/image-size/dist/types/icns.js
var require_icns = __commonJS({
  "node_modules/image-size/dist/types/icns.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ICNS = void 0;
    var utils_1 = require_utils();
    var SIZE_HEADER = 4 + 4;
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
        (0, utils_1.toUTF8String)(input, imageOffset, imageLengthOffset),
        (0, utils_1.readUInt32BE)(input, imageLengthOffset)
      ];
    }
    function getImageSize(type) {
      const size = ICON_TYPE_SIZE[type];
      return { width: size, height: size, type };
    }
    exports2.ICNS = {
      validate: (input) => (0, utils_1.toUTF8String)(input, 0, 4) === "icns",
      calculate(input) {
        const inputLength = input.length;
        const fileLength = (0, utils_1.readUInt32BE)(input, FILE_LENGTH_OFFSET);
        let imageOffset = SIZE_HEADER;
        let imageHeader = readImageHeader(input, imageOffset);
        let imageSize = getImageSize(imageHeader[0]);
        imageOffset += imageHeader[1];
        if (imageOffset === fileLength)
          return imageSize;
        const result = {
          height: imageSize.height,
          images: [imageSize],
          width: imageSize.width
        };
        while (imageOffset < fileLength && imageOffset < inputLength) {
          imageHeader = readImageHeader(input, imageOffset);
          imageSize = getImageSize(imageHeader[0]);
          imageOffset += imageHeader[1];
          result.images.push(imageSize);
        }
        return result;
      }
    };
  }
});

// node_modules/image-size/dist/types/j2c.js
var require_j2c = __commonJS({
  "node_modules/image-size/dist/types/j2c.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.J2C = void 0;
    var utils_1 = require_utils();
    exports2.J2C = {
      // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
      validate: (input) => (0, utils_1.toHexString)(input, 0, 4) === "ff4fff51",
      calculate: (input) => ({
        height: (0, utils_1.readUInt32BE)(input, 12),
        width: (0, utils_1.readUInt32BE)(input, 8)
      })
    };
  }
});

// node_modules/image-size/dist/types/jp2.js
var require_jp2 = __commonJS({
  "node_modules/image-size/dist/types/jp2.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.JP2 = void 0;
    var utils_1 = require_utils();
    exports2.JP2 = {
      validate(input) {
        if ((0, utils_1.readUInt32BE)(input, 4) !== 1783636e3 || (0, utils_1.readUInt32BE)(input, 0) < 1)
          return false;
        const ftypBox = (0, utils_1.findBox)(input, "ftyp", 0);
        if (!ftypBox)
          return false;
        return (0, utils_1.readUInt32BE)(input, ftypBox.offset + 4) === 1718909296;
      },
      calculate(input) {
        const jp2hBox = (0, utils_1.findBox)(input, "jp2h", 0);
        const ihdrBox = jp2hBox && (0, utils_1.findBox)(input, "ihdr", jp2hBox.offset + 8);
        if (ihdrBox) {
          return {
            height: (0, utils_1.readUInt32BE)(input, ihdrBox.offset + 8),
            width: (0, utils_1.readUInt32BE)(input, ihdrBox.offset + 12)
          };
        }
        throw new TypeError("Unsupported JPEG 2000 format");
      }
    };
  }
});

// node_modules/image-size/dist/types/jpg.js
var require_jpg = __commonJS({
  "node_modules/image-size/dist/types/jpg.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.JPG = void 0;
    var utils_1 = require_utils();
    var EXIF_MARKER = "45786966";
    var APP1_DATA_SIZE_BYTES = 2;
    var EXIF_HEADER_BYTES = 6;
    var TIFF_BYTE_ALIGN_BYTES = 2;
    var BIG_ENDIAN_BYTE_ALIGN = "4d4d";
    var LITTLE_ENDIAN_BYTE_ALIGN = "4949";
    var IDF_ENTRY_BYTES = 12;
    var NUM_DIRECTORY_ENTRIES_BYTES = 2;
    function isEXIF(input) {
      return (0, utils_1.toHexString)(input, 2, 6) === EXIF_MARKER;
    }
    function extractSize(input, index) {
      return {
        height: (0, utils_1.readUInt16BE)(input, index),
        width: (0, utils_1.readUInt16BE)(input, index + 2)
      };
    }
    function extractOrientation(exifBlock, isBigEndian) {
      const idfOffset = 8;
      const offset = EXIF_HEADER_BYTES + idfOffset;
      const idfDirectoryEntries = (0, utils_1.readUInt)(exifBlock, 16, offset, isBigEndian);
      for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
        const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
        const end = start + IDF_ENTRY_BYTES;
        if (start > exifBlock.length) {
          return;
        }
        const block = exifBlock.slice(start, end);
        const tagNumber = (0, utils_1.readUInt)(block, 16, 0, isBigEndian);
        if (tagNumber === 274) {
          const dataFormat = (0, utils_1.readUInt)(block, 16, 2, isBigEndian);
          if (dataFormat !== 3) {
            return;
          }
          const numberOfComponents = (0, utils_1.readUInt)(block, 32, 4, isBigEndian);
          if (numberOfComponents !== 1) {
            return;
          }
          return (0, utils_1.readUInt)(block, 16, 8, isBigEndian);
        }
      }
    }
    function validateExifBlock(input, index) {
      const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
      const byteAlign = (0, utils_1.toHexString)(exifBlock, EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
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
    exports2.JPG = {
      validate: (input) => (0, utils_1.toHexString)(input, 0, 2) === "ffd8",
      calculate(input) {
        input = input.slice(4);
        let orientation;
        let next;
        while (input.length) {
          const i = (0, utils_1.readUInt16BE)(input, 0);
          if (input[i] !== 255) {
            input = input.slice(1);
            continue;
          }
          if (isEXIF(input)) {
            orientation = validateExifBlock(input, i);
          }
          validateInput(input, i);
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
  }
});

// node_modules/image-size/dist/types/ktx.js
var require_ktx = __commonJS({
  "node_modules/image-size/dist/types/ktx.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.KTX = void 0;
    var utils_1 = require_utils();
    exports2.KTX = {
      validate: (input) => {
        const signature = (0, utils_1.toUTF8String)(input, 1, 7);
        return ["KTX 11", "KTX 20"].includes(signature);
      },
      calculate: (input) => {
        const type = input[5] === 49 ? "ktx" : "ktx2";
        const offset = type === "ktx" ? 36 : 20;
        return {
          height: (0, utils_1.readUInt32LE)(input, offset + 4),
          width: (0, utils_1.readUInt32LE)(input, offset),
          type
        };
      }
    };
  }
});

// node_modules/image-size/dist/types/png.js
var require_png = __commonJS({
  "node_modules/image-size/dist/types/png.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PNG = void 0;
    var utils_1 = require_utils();
    var pngSignature = "PNG\r\n\n";
    var pngImageHeaderChunkName = "IHDR";
    var pngFriedChunkName = "CgBI";
    exports2.PNG = {
      validate(input) {
        if (pngSignature === (0, utils_1.toUTF8String)(input, 1, 8)) {
          let chunkName = (0, utils_1.toUTF8String)(input, 12, 16);
          if (chunkName === pngFriedChunkName) {
            chunkName = (0, utils_1.toUTF8String)(input, 28, 32);
          }
          if (chunkName !== pngImageHeaderChunkName) {
            throw new TypeError("Invalid PNG");
          }
          return true;
        }
        return false;
      },
      calculate(input) {
        if ((0, utils_1.toUTF8String)(input, 12, 16) === pngFriedChunkName) {
          return {
            height: (0, utils_1.readUInt32BE)(input, 36),
            width: (0, utils_1.readUInt32BE)(input, 32)
          };
        }
        return {
          height: (0, utils_1.readUInt32BE)(input, 20),
          width: (0, utils_1.readUInt32BE)(input, 16)
        };
      }
    };
  }
});

// node_modules/image-size/dist/types/pnm.js
var require_pnm = __commonJS({
  "node_modules/image-size/dist/types/pnm.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PNM = void 0;
    var utils_1 = require_utils();
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
            height: parseInt(dimensions[1], 10),
            width: parseInt(dimensions[0], 10)
          };
        } else {
          throw new TypeError("Invalid PNM");
        }
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
            size[key.toLowerCase()] = parseInt(value, 10);
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
        } else {
          throw new TypeError("Invalid PAM");
        }
      }
    };
    exports2.PNM = {
      validate: (input) => (0, utils_1.toUTF8String)(input, 0, 2) in PNMTypes,
      calculate(input) {
        const signature = (0, utils_1.toUTF8String)(input, 0, 2);
        const type = PNMTypes[signature];
        const lines = (0, utils_1.toUTF8String)(input, 3).split(/[\r\n]+/);
        const handler = handlers[type] || handlers.default;
        return handler(lines);
      }
    };
  }
});

// node_modules/image-size/dist/types/psd.js
var require_psd = __commonJS({
  "node_modules/image-size/dist/types/psd.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PSD = void 0;
    var utils_1 = require_utils();
    exports2.PSD = {
      validate: (input) => (0, utils_1.toUTF8String)(input, 0, 4) === "8BPS",
      calculate: (input) => ({
        height: (0, utils_1.readUInt32BE)(input, 14),
        width: (0, utils_1.readUInt32BE)(input, 18)
      })
    };
  }
});

// node_modules/image-size/dist/types/svg.js
var require_svg = __commonJS({
  "node_modules/image-size/dist/types/svg.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SVG = void 0;
    var utils_1 = require_utils();
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
    var unitsReg = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`);
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
    exports2.SVG = {
      // Scan only the first kilo-byte to speed up the check on larger files
      validate: (input) => svgReg.test((0, utils_1.toUTF8String)(input, 0, 1e3)),
      calculate(input) {
        const root = (0, utils_1.toUTF8String)(input).match(extractorRegExps.root);
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
  }
});

// node_modules/image-size/dist/types/tga.js
var require_tga = __commonJS({
  "node_modules/image-size/dist/types/tga.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TGA = void 0;
    var utils_1 = require_utils();
    exports2.TGA = {
      validate(input) {
        return (0, utils_1.readUInt16LE)(input, 0) === 0 && (0, utils_1.readUInt16LE)(input, 4) === 0;
      },
      calculate(input) {
        return {
          height: (0, utils_1.readUInt16LE)(input, 14),
          width: (0, utils_1.readUInt16LE)(input, 12)
        };
      }
    };
  }
});

// node_modules/image-size/dist/types/tiff.js
var require_tiff = __commonJS({
  "node_modules/image-size/dist/types/tiff.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TIFF = void 0;
    var fs2 = require("fs");
    var utils_1 = require_utils();
    function readIFD(input, filepath, isBigEndian) {
      const ifdOffset = (0, utils_1.readUInt)(input, 32, 4, isBigEndian);
      let bufferSize = 1024;
      const fileSize = fs2.statSync(filepath).size;
      if (ifdOffset + bufferSize > fileSize) {
        bufferSize = fileSize - ifdOffset - 10;
      }
      const endBuffer = new Uint8Array(bufferSize);
      const descriptor = fs2.openSync(filepath, "r");
      fs2.readSync(descriptor, endBuffer, 0, bufferSize, ifdOffset);
      fs2.closeSync(descriptor);
      return endBuffer.slice(2);
    }
    function readValue(input, isBigEndian) {
      const low = (0, utils_1.readUInt)(input, 16, 8, isBigEndian);
      const high = (0, utils_1.readUInt)(input, 16, 10, isBigEndian);
      return (high << 16) + low;
    }
    function nextTag(input) {
      if (input.length > 24) {
        return input.slice(12);
      }
    }
    function extractTags(input, isBigEndian) {
      const tags = {};
      let temp = input;
      while (temp && temp.length) {
        const code = (0, utils_1.readUInt)(temp, 16, 0, isBigEndian);
        const type = (0, utils_1.readUInt)(temp, 16, 2, isBigEndian);
        const length = (0, utils_1.readUInt)(temp, 32, 4, isBigEndian);
        if (code === 0) {
          break;
        } else {
          if (length === 1 && (type === 3 || type === 4)) {
            tags[code] = readValue(temp, isBigEndian);
          }
          temp = nextTag(temp);
        }
      }
      return tags;
    }
    function determineEndianness(input) {
      const signature = (0, utils_1.toUTF8String)(input, 0, 2);
      if ("II" === signature) {
        return "LE";
      } else if ("MM" === signature) {
        return "BE";
      }
    }
    var signatures = [
      // '492049', // currently not supported
      "49492a00",
      // Little endian
      "4d4d002a"
      // Big Endian
      // '4d4d002a', // BigTIFF > 4GB. currently not supported
    ];
    exports2.TIFF = {
      validate: (input) => signatures.includes((0, utils_1.toHexString)(input, 0, 4)),
      calculate(input, filepath) {
        if (!filepath) {
          throw new TypeError("Tiff doesn't support buffer");
        }
        const isBigEndian = determineEndianness(input) === "BE";
        const ifdBuffer = readIFD(input, filepath, isBigEndian);
        const tags = extractTags(ifdBuffer, isBigEndian);
        const width = tags[256];
        const height = tags[257];
        if (!width || !height) {
          throw new TypeError("Invalid Tiff. Missing tags");
        }
        return { height, width };
      }
    };
  }
});

// node_modules/image-size/dist/types/webp.js
var require_webp = __commonJS({
  "node_modules/image-size/dist/types/webp.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WEBP = void 0;
    var utils_1 = require_utils();
    function calculateExtended(input) {
      return {
        height: 1 + (0, utils_1.readUInt24LE)(input, 7),
        width: 1 + (0, utils_1.readUInt24LE)(input, 4)
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
        height: (0, utils_1.readInt16LE)(input, 8) & 16383,
        width: (0, utils_1.readInt16LE)(input, 6) & 16383
      };
    }
    exports2.WEBP = {
      validate(input) {
        const riffHeader = "RIFF" === (0, utils_1.toUTF8String)(input, 0, 4);
        const webpHeader = "WEBP" === (0, utils_1.toUTF8String)(input, 8, 12);
        const vp8Header = "VP8" === (0, utils_1.toUTF8String)(input, 12, 15);
        return riffHeader && webpHeader && vp8Header;
      },
      calculate(input) {
        const chunkHeader = (0, utils_1.toUTF8String)(input, 12, 16);
        input = input.slice(20, 30);
        if (chunkHeader === "VP8X") {
          const extendedHeader = input[0];
          const validStart = (extendedHeader & 192) === 0;
          const validEnd = (extendedHeader & 1) === 0;
          if (validStart && validEnd) {
            return calculateExtended(input);
          } else {
            throw new TypeError("Invalid WebP");
          }
        }
        if (chunkHeader === "VP8 " && input[0] !== 47) {
          return calculateLossy(input);
        }
        const signature = (0, utils_1.toHexString)(input, 3, 6);
        if (chunkHeader === "VP8L" && signature !== "9d012a") {
          return calculateLossless(input);
        }
        throw new TypeError("Invalid WebP");
      }
    };
  }
});

// node_modules/image-size/dist/types/index.js
var require_types = __commonJS({
  "node_modules/image-size/dist/types/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.typeHandlers = void 0;
    var bmp_1 = require_bmp();
    var cur_1 = require_cur();
    var dds_1 = require_dds();
    var gif_1 = require_gif();
    var heif_1 = require_heif();
    var icns_1 = require_icns();
    var ico_1 = require_ico();
    var j2c_1 = require_j2c();
    var jp2_1 = require_jp2();
    var jpg_1 = require_jpg();
    var ktx_1 = require_ktx();
    var png_1 = require_png();
    var pnm_1 = require_pnm();
    var psd_1 = require_psd();
    var svg_1 = require_svg();
    var tga_1 = require_tga();
    var tiff_1 = require_tiff();
    var webp_1 = require_webp();
    exports2.typeHandlers = {
      bmp: bmp_1.BMP,
      cur: cur_1.CUR,
      dds: dds_1.DDS,
      gif: gif_1.GIF,
      heif: heif_1.HEIF,
      icns: icns_1.ICNS,
      ico: ico_1.ICO,
      j2c: j2c_1.J2C,
      jp2: jp2_1.JP2,
      jpg: jpg_1.JPG,
      ktx: ktx_1.KTX,
      png: png_1.PNG,
      pnm: pnm_1.PNM,
      psd: psd_1.PSD,
      svg: svg_1.SVG,
      tga: tga_1.TGA,
      tiff: tiff_1.TIFF,
      webp: webp_1.WEBP
    };
  }
});

// node_modules/image-size/dist/detector.js
var require_detector = __commonJS({
  "node_modules/image-size/dist/detector.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.detector = void 0;
    var index_1 = require_types();
    var keys = Object.keys(index_1.typeHandlers);
    var firstBytes = {
      56: "psd",
      66: "bmp",
      68: "dds",
      71: "gif",
      73: "tiff",
      77: "tiff",
      82: "webp",
      105: "icns",
      137: "png",
      255: "jpg"
    };
    function detector(input) {
      const byte = input[0];
      if (byte in firstBytes) {
        const type = firstBytes[byte];
        if (type && index_1.typeHandlers[type].validate(input)) {
          return type;
        }
      }
      const finder = (key) => index_1.typeHandlers[key].validate(input);
      return keys.find(finder);
    }
    exports2.detector = detector;
  }
});

// node_modules/image-size/dist/index.js
var require_dist = __commonJS({
  "node_modules/image-size/dist/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.types = exports2.setConcurrency = exports2.disableTypes = exports2.disableFS = exports2.imageSize = void 0;
    var fs2 = require("fs");
    var path2 = require("path");
    var queue_1 = require_queue();
    var index_1 = require_types();
    var detector_1 = require_detector();
    var MaxInputSize = 512 * 1024;
    var queue = new queue_1.default({ concurrency: 100, autostart: true });
    var globalOptions = {
      disabledFS: false,
      disabledTypes: []
    };
    function lookup(input, filepath) {
      const type = (0, detector_1.detector)(input);
      if (typeof type !== "undefined") {
        if (globalOptions.disabledTypes.indexOf(type) > -1) {
          throw new TypeError("disabled file type: " + type);
        }
        if (type in index_1.typeHandlers) {
          const size = index_1.typeHandlers[type].calculate(input, filepath);
          if (size !== void 0) {
            size.type = size.type ?? type;
            return size;
          }
        }
      }
      throw new TypeError("unsupported file type: " + type + " (file: " + filepath + ")");
    }
    async function readFileAsync(filepath) {
      const handle = await fs2.promises.open(filepath, "r");
      try {
        const { size } = await handle.stat();
        if (size <= 0) {
          throw new Error("Empty file");
        }
        const inputSize = Math.min(size, MaxInputSize);
        const input = new Uint8Array(inputSize);
        await handle.read(input, 0, inputSize, 0);
        return input;
      } finally {
        await handle.close();
      }
    }
    function readFileSync(filepath) {
      const descriptor = fs2.openSync(filepath, "r");
      try {
        const { size } = fs2.fstatSync(descriptor);
        if (size <= 0) {
          throw new Error("Empty file");
        }
        const inputSize = Math.min(size, MaxInputSize);
        const input = new Uint8Array(inputSize);
        fs2.readSync(descriptor, input, 0, inputSize, 0);
        return input;
      } finally {
        fs2.closeSync(descriptor);
      }
    }
    module2.exports = exports2 = imageSize;
    exports2.default = imageSize;
    function imageSize(input, callback) {
      if (input instanceof Uint8Array) {
        return lookup(input);
      }
      if (typeof input !== "string" || globalOptions.disabledFS) {
        throw new TypeError("invalid invocation. input should be a Uint8Array");
      }
      const filepath = path2.resolve(input);
      if (typeof callback === "function") {
        queue.push(() => readFileAsync(filepath).then((input2) => process.nextTick(callback, null, lookup(input2, filepath))).catch(callback));
      } else {
        const input2 = readFileSync(filepath);
        return lookup(input2, filepath);
      }
    }
    exports2.imageSize = imageSize;
    var disableFS = (v) => {
      globalOptions.disabledFS = v;
    };
    exports2.disableFS = disableFS;
    var disableTypes = (types) => {
      globalOptions.disabledTypes = types;
    };
    exports2.disableTypes = disableTypes;
    var setConcurrency = (c) => {
      queue.concurrency = c;
    };
    exports2.setConcurrency = setConcurrency;
    exports2.types = Object.keys(index_1.typeHandlers);
  }
});

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
var fs = require("fs");
var path = require("path");
var os = require("os");
var sizeOf = require_dist();
var defaultIconPath = "resources/panic-icon.gif";
var defaultIconWidth = "14px";
var defaultIconHeight = "14px";
function objectToCssString(settings) {
  let value = "";
  const cssString = Object.keys(settings).map((setting) => {
    value = settings[setting];
    if (typeof value === "string" || typeof value === "number") {
      return `${setting}: ${value};`;
    }
  }).join(" ");
  return cssString;
}
function calculateEditorLineHeight() {
  const editorConfig = vscode.workspace.getConfiguration("editor");
  const fontSize = editorConfig.get("fontSize") || 14;
  const lineHeightSetting = editorConfig.get("lineHeight") || 0;
  let lineHeight;
  if (lineHeightSetting === 0) {
    lineHeight = fontSize;
  } else if (lineHeightSetting > 0 && lineHeightSetting < 8) {
    lineHeight = fontSize * lineHeightSetting;
  } else {
    lineHeight = lineHeightSetting;
  }
  return lineHeight;
}
var getIconPath = (iconPathSetting, width, height) => {
  const ext = path.extname(iconPathSetting).toLowerCase();
  const supportedFormats = [".gif", ".png", ".jpg", ".jpeg"];
  if (supportedFormats.includes(ext)) {
    const iconData = fs.readFileSync(iconPathSetting);
    const base64Data = iconData.toString("base64");
    let mimeType = "";
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
        throw new Error(`Format d'image non pris en charge : ${ext}`);
    }
    const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <image href="data:${mimeType};base64,${base64Data}" width="${width}" height="${height}"/>
            </svg>
        `;
    const tempDir = os.tmpdir();
    const tempSvgPath = path.join(tempDir, `icon_tmp.svg`);
    fs.writeFileSync(tempSvgPath, svgContent, "utf8");
    return tempSvgPath;
  }
  return iconPathSetting;
};
function activate(context) {
  let diagnosticCollection = vscode.languages.createDiagnosticCollection("rust-panic-highlighter");
  context.subscriptions.push(diagnosticCollection);
  function createDecorationType() {
    const isEnabled = vscode.workspace.getConfiguration().get("icon.enabled") ?? true;
    if (!isEnabled) {
      return vscode.window.createTextEditorDecorationType({});
    }
    let iconPathSetting = vscode.workspace.getConfiguration().get("icon.path") || "default";
    if (iconPathSetting === "default") {
      iconPathSetting = context.asAbsolutePath(defaultIconPath);
    }
    const iconWidthSetting = vscode.workspace.getConfiguration().get("icon.width") || defaultIconWidth;
    const iconHeightSetting = vscode.workspace.getConfiguration().get("icon.height") || defaultIconHeight;
    const iconPath_tmp = getIconPath(iconPathSetting, iconWidthSetting, iconHeightSetting);
    const iconsize = sizeOf(iconPath_tmp);
    const iconPath = vscode.Uri.file(iconPath_tmp);
    const lineHeight = calculateEditorLineHeight();
    const iconHeight = iconsize.height;
    console.log(`iconHeight: ${iconsize.height}`);
    console.log(`lineWidth: ${iconsize.width}`);
    const topValue = iconHeight <= lineHeight ? (lineHeight - iconHeight) / 2 : -(iconHeight - lineHeight) / 2;
    const defaultCss = {
      position: "absolute",
      top: `${topValue}px`,
      ["z-index"]: 1,
      ["pointer-events"]: "none"
    };
    const defaultCssString = objectToCssString(defaultCss);
    return vscode.window.createTextEditorDecorationType({
      after: {
        contentIconPath: iconPath,
        textDecoration: `none; ${defaultCssString}`,
        // width: iconWidthSetting,
        // height: iconHeightSetting,
        margin: "0 1rem"
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
    if (doc.languageId === "rust") {
      diagnosticCollection.delete(doc.uri);
    }
  });
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("icon.enabled") || event.affectsConfiguration("icon.path") || event.affectsConfiguration("icon.width") || event.affectsConfiguration("icon.height")) {
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
  const severitySetting = vscode.workspace.getConfiguration().get("diagnostic.severity");
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
