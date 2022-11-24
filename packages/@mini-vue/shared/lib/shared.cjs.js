'use strict';

var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === "object";
};
var hasChanged = function (newValue, value) {
    return !Object.is(value, newValue);
};

exports.extend = extend;
exports.hasChanged = hasChanged;
exports.isObject = isObject;
//# sourceMappingURL=shared.cjs.js.map
