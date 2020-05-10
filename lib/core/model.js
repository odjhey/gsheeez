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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var utils_1 = require("./utils");
var createGetById = function (schema, grid, toJSON) { return function (id) {
    var objs = toJSON(schema, grid);
    var filtered = objs.filter(function (obj) {
        return obj.__metadata.uid === id;
    });
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
}; };
var createGetOne = function (schema, grid, toJSON) { return function (filter) {
    var objs = toJSON(schema, grid);
    var filtered = objs.filter(function (obj) {
        var pass = true;
        Object.keys(filter).forEach(function (f) {
            if (obj[f] === filter[f]) {
                // guchi
            }
            else {
                pass = false;
            }
        });
        return pass;
    });
    if (filtered.length > 0) {
        return filtered[0];
    }
    return null;
}; };
var getFieldFromSchema = function (fieldname, schema) {
    var sch = schema.filter(function (item) { return item.key === fieldname; });
    return sch[0];
};
var createChangeRecord = function (from, to, info) { return ({
    fieldname: info.fieldname,
    value: { from: from, to: to },
    __metadata: {
        rowIdx: info.rowIdx,
        column: info.column,
    },
}); };
var createFilter = function (schema, grid, toJSON) { return function (filter) {
    var objs = toJSON(schema, grid);
    var filtered = objs.filter(filter);
    return filtered;
}; };
var getIndexOfSchemaFromBaseSchema = function (schema, baseSchema) {
    var retVal = schema.map(function (col) {
        var baseSchemaField = baseSchema.find(function (element) { return element.key === col.key; });
        if (!baseSchemaField) {
            throw new Error(col.key + " not found in base schema.");
        }
        return baseSchemaField.__metadata.idx;
    });
    return retVal;
};
/*eslint no-use-before-define: off */
var makeCreateModel = function (hashFn) { return function (schema, _grid, rowIdxs) {
    var changes = [];
    var grid;
    //  const lGetGrid = (options): TGrid => {
    //    if (options.applyUnsavedUpdates) {
    //      const patch = changes.flatMap((change) => {
    //        return change.__metadata.rowIdx.map((ridx) => ({
    //          rowIdx: ridx - 1,
    //          colIdx: getFieldFromSchema(change.fieldname, schema).__metadata.idx,
    //          newValue: change.value.to,
    //        }))
    //      })
    //      const newGrid = Array.from(grid || [])
    //      patch.forEach((p) => {
    //        newGrid[p.rowIdx][p.colIdx] = p.newValue
    //      })
    //      return newGrid
    //    }
    //    return grid
    //  }
    var makeToJSON = function (phashFn, groupingIdxs, options) { return function (pschema, pgrid) {
        var jsonObj = utils_1.makeToJSONWithSchema(phashFn)(pschema, pgrid, groupingIdxs);
        if (options.applyUnsavedUpdates) {
            var withPatch = jsonObj.map(function (row) {
                var newRow = row;
                changes.forEach(function (p) {
                    if (row.__metadata.rowIdx.includes(p.__metadata.rowIdx[0])) {
                        newRow[p.fieldname] = p.value.to;
                    }
                });
                return newRow;
            });
            return withPatch;
        }
        return jsonObj;
    }; };
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    var setGrid = function (newGrid, oldGrid) {
        //    if (newGrid) {
        //      if (newGrid.length > schema.length) {
        //        console.warn(
        //          'Grid is longer than defined schema. Some grid data will not be captured.',
        //        )
        //      } else if (newGrid.length < schema.length) {
        //        console.warn(
        //          'Schema is longer than grid. Some fields will be undefined.',
        //        )
        //      }
        //    }
        return newGrid;
    };
    grid = setGrid(_grid, grid);
    var model = {
        getAll: function (options) {
            if (options === void 0) { options = { applyUnsavedUpdates: true }; }
            return makeToJSON(hashFn, rowIdxs, options)(schema, grid);
        },
        get: function (filter, options) {
            if (options === void 0) { options = { applyUnsavedUpdates: true }; }
            return createGetOne(schema, grid, makeToJSON(hashFn, rowIdxs, options))(filter);
        },
        getById: function (id, options) {
            if (options === void 0) { options = { applyUnsavedUpdates: true }; }
            return createGetById(schema, grid, makeToJSON(hashFn, rowIdxs, options))(id);
        },
        update: function (obj, fields) {
            var newObj = __assign({}, obj);
            Object.keys(fields).forEach(function (f) {
                newObj.__metadata.rowIdx.forEach(function (rid) {
                    changes.push(createChangeRecord(newObj[f], fields[f], {
                        fieldname: f,
                        rowIdx: [rid],
                        column: getFieldFromSchema(f, schema).__metadata.column,
                    }));
                });
                newObj[f] = fields[f];
            });
            return newObj;
        },
        filter: function (filterFn, options) {
            if (options === void 0) { options = { applyUnsavedUpdates: true }; }
            return createFilter(schema, grid, makeToJSON(hashFn, rowIdxs, options))(filterFn);
        },
        setGrid: function (newGrid) {
            grid = setGrid(newGrid, grid);
        },
        getGrid: function () { return grid; },
        setGridRefresh: function (refresh) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, refresh()];
                    case 1:
                        grid = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        getChanges: function () { return changes; },
        clearChanges: function () {
            changes = [];
        },
        groupByKeys: function (options) {
            if (options === void 0) { options = { keysOnly: false }; }
            return makeGroupByKeys(hashFn, model)(options);
        },
        __metadata: {
            schema: schema,
        },
    };
    return model;
}; };
exports.makeCreateModel = makeCreateModel;
var makeGroupByKeys = function (hashFn, baseModel) { return function (options) {
    var createFromBaseModel = makeCreateModelsFromBaseModel(hashFn);
    var _a = __read(createFromBaseModel([baseModel.__metadata.schema], baseModel, options), 1), newModel = _a[0];
    return newModel;
}; };
var getGroupedGrid = function (grid, keyGridIdx) {
    return grid.reduce(function (newGrid, row, reduceIdx) {
        // compare indexes of row and accu
        var alreadyInRecord = newGrid.find(function (newGridRow) {
            return keyGridIdx.reduce(function (isUniq, schemaIdx) {
                return newGridRow.values[schemaIdx] === row[schemaIdx] && isUniq;
            }, true);
        });
        if (!alreadyInRecord) {
            newGrid.push({
                values: row,
                idxs: [reduceIdx],
            });
        }
        else {
            alreadyInRecord.idxs.push(reduceIdx);
        }
        return newGrid;
    }, []);
};
/*eslint no-use-before-define: off */
var makeCreateModelsFromBaseModel = function (hashFn) { return function (schemas, baseModel, options) {
    if (options === void 0) { options = { keysOnly: false }; }
    var models = schemas.map(function (schema) {
        var baseSchema = baseModel.__metadata.schema;
        var schemaXoptions = schema.filter(function (s) {
            return options.keysOnly ? s.__metadata.isUniqueIdfier : true;
        });
        var idxFromSchema = getIndexOfSchemaFromBaseSchema(schemaXoptions, baseSchema);
        // get unique entries of grid
        var groupedGrid = getGroupedGrid(baseModel.getGrid(), idxFromSchema);
        //update schema, add baseIndex
        var newSchemaWithBaseIdx = schemaXoptions.map(function (item, idx) {
            return __assign(__assign({}, item), { __metadata: __assign(__assign({}, item.__metadata), { baseIdx: idxFromSchema[idx] }) });
        });
        var groupedGridVals = groupedGrid.map(function (g) {
            return g.values;
        });
        var gridFilteredByCol = groupedGridVals.map(function (row) {
            var newRow = [];
            idxFromSchema.forEach(function (i) {
                newRow.push(row[i]);
            });
            return newRow;
        });
        return makeCreateModel(hashFn)(newSchemaWithBaseIdx, gridFilteredByCol, groupedGrid.map(function (g) {
            return g.idxs;
        }));
    });
    return models;
}; };
exports.makeCreateModelsFromBaseModel = makeCreateModelsFromBaseModel;
