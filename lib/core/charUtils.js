"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var charUtils = (function () {
    var nextChar = function (curr) {
        var currNoCase = curr.toUpperCase(curr);
        var max = 'Z'.charCodeAt(0); //90
        var min = 'A'.charCodeAt(0); //65
        var arr = currNoCase.split('');
        var getNextNum = function (num) {
            return num < max
                ? {
                    curr: num,
                    next: num + 1,
                    overflow: false,
                }
                : {
                    curr: num,
                    next: min,
                    overflow: true,
                };
        };
        var nextArrObj = arr.map(function (item) {
            var charCode = item.charCodeAt(0);
            var nextCharCode = getNextNum(charCode);
            return nextCharCode;
        });
        var nextToken = nextArrObj
            .reverse()
            .reduce(function (accu, item, idx, myarr) {
            if (idx === 0) {
                accu.push(item.next);
            }
            else if (myarr[idx - 1].overflow) {
                //if previous is overflow
                accu.push(item.next);
            }
            else {
                accu.push(item.curr);
            }
            // last token
            if (idx + 1 === myarr.length && item.overflow) {
                accu.push(min);
            }
            return accu;
        }, [])
            .reverse()
            .map(function (item) { return String.fromCharCode(item); });
        return nextToken.join('');
    };
    var compare = function (a, b) {
        /**
         * Negative when the referenceStr occurs before compareStr
         * Positive when the referenceStr occurs after compareStr
         * Returns 0 if they are equivalent
         * DO NOT rely on exact return values of -1 or 1.
         * NOTE: Negative and positive integer results vary between browsers
         * (as well as between browser versions) because
         * the W3C specification only mandates negative and positive values.
         * Some browsers may return -2 or 2 or even some
         * other negative or positive value.
         */
        return a.length - b.length || a.localeCompare(b, 'en');
    };
    var generateFromRange = function (from, to) {
        var range = [];
        var token = from;
        while (compare(token, to) <= 0) {
            range.push(token);
            token = nextChar(token);
        }
        return range;
    };
    return { nextChar: nextChar, compare: compare, generateFromRange: generateFromRange };
})();
exports.default = charUtils;
