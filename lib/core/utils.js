"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var getSchemaKeys = function (schema) {
    var keys = schema.filter(function (field) { return field.__metadata.isUniqueIdfier; });
    if (!keys)
        return schema;
    if (keys.length < 1)
        return schema;
    return keys;
};
var castObjToSchema = function (schema, obj) {
    var header = schema.map(function (item) { return item.key; });
    var newObj = {};
    header.forEach(function (key) {
        newObj[key] = obj[key];
    });
    return newObj;
};
var makeToJSONWithSchema = function (hashFn) { return function (schema, grid, rowIdxs) {
    if (grid === void 0) { grid = []; }
    // convert to json obj, header = idx 0
    var toJson = [];
    var header = schema.map(function (item) { return item.key; });
    grid.forEach(function (row, rowIdx) {
        var lineObj = {};
        header.forEach(function (field, col) {
            lineObj[header[col]] = row[col];
        });
        if (rowIdxs) {
            lineObj.__metadata = { rowIdx: rowIdxs[rowIdx].map(function (r) { return r + 1; }) };
        }
        else {
            lineObj.__metadata = { rowIdx: [rowIdx + 1] };
        }
        lineObj.__metadata.uid = hashFn(JSON.stringify(castObjToSchema(getSchemaKeys(schema), lineObj)));
        toJson.push(lineObj);
    });
    return toJson;
}; };
exports.makeToJSONWithSchema = makeToJSONWithSchema;
var mergeSchema = function (schemas) {
    var newSchema = schemas.flatMap(function (s) { return s; });
    return newSchema.map(function (f, idx) {
        return __assign(__assign({}, f), { __metadata: __assign(__assign({}, f.__metadata), { idx: idx }) });
    });
};
exports.mergeSchema = mergeSchema;
