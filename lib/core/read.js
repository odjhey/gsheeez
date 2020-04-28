"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function groupByKeys(keys, data) {
    // const distinctKeys = [ ...new Set(keys)]
    var distinctKeys = keys.reduce(function (collector, item) {
        if (collector === void 0) { collector = []; }
        if (collector.filter(function (citem) {
            return JSON.stringify(citem) === JSON.stringify(item);
        }).length === 0) {
            collector.push(item);
        }
        return collector;
    }, []);
    var complete = distinctKeys.map(function (itemKey) {
        return {
            key: itemKey,
            items: data.filter(function (fitem) {
                var isPass = true;
                Object.keys(itemKey).forEach(function (key) {
                    if (itemKey[key] === fitem[key]) {
                        //
                    }
                    else {
                        isPass = false;
                    }
                });
                return isPass;
            }),
        };
    });
    return complete;
}
var read = { groupByKeys: groupByKeys };
exports.default = read;
