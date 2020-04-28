"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var charUtils_1 = require("./charUtils");
var createSchema = function (input) {
    var _a = __read(input.range.split(':'), 2), from = _a[0], to = _a[1];
    var generateFromRange = charUtils_1.default.generateFromRange;
    //  let token = from
    //  const chars = []
    //  if (from.charCodeAt(0) <= to.charCodeAt(0)) {
    //    while (token <= to) {
    //      chars.push(token)
    //      token = String.fromCharCode(token.charCodeAt(0) + 1)
    //    }
    //  }
    var chars = generateFromRange(from, to);
    if (chars.length !== input.header.length) {
        if (chars.length > input.header.length)
            throw new Error("Range(" + chars.length + " columns - " + input.range + ") covers more than specified. (" + input.header.length + " fields)");
        throw new Error("Range(" + chars.length + " columns - " + input.range + ") covers less than specified. (" + input.header.length + " fields)");
    }
    //validate keys are in header
    if (input.keys) {
        input.keys.forEach(function (k) {
            if (!input.header.includes(k)) {
                throw new Error("Key " + k + " not specified in header.");
            }
            else {
                //console.log('nice im found', k)
            }
        });
    }
    var schema = chars.map(function (char, idx) { return ({
        key: input.header[idx],
        __metadata: {
            column: char,
            idx: idx,
            isUniqueIdfier: (function () {
                if (input.keys && input.keys.find(function (k) { return input.header[idx] === k; })) {
                    return true;
                }
                //no keys provided, make all fields a key
                if (!input.keys)
                    return true;
                return false;
            })(),
        },
    }); });
    return schema;
};
exports.createSchema = createSchema;
