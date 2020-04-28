"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var splitGrid = function (grid, hidx) {
    if (hidx === void 0) { hidx = 0; }
    var header = grid[hidx];
    var body = Array.from(grid);
    body.shift();
    return [header, body];
};
exports.splitGrid = splitGrid;
var toJSON = function (rows) {
    // convert to json obj, header = idx 0
    var toJson = [];
    var header = [];
    rows.forEach(function (row, rowIdx) {
        if (rowIdx === 0) {
            header = row;
        }
        else {
            var lineObj_1 = {};
            header.forEach(function (field, col) {
                lineObj_1[header[col]] = row[col];
            });
            lineObj_1.rowIdx = rowIdx;
            toJson.push(lineObj_1);
        }
    });
    return toJson;
};
exports.toJSON = toJSON;
var getByKey = function (key, grid) {
    var givenGrid = grid;
    var gridJson = toJSON(givenGrid);
    var fil = gridJson.filter(function (item) {
        var pass = Object.keys(key)
            .map(function (keyField) {
            return item[keyField] === key[keyField];
        })
            .reduce(function (accu, bool) {
            return bool && accu;
        }, true);
        return pass;
    });
    return fil[0];
};
exports.getByKey = getByKey;
