var hasOwn = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };
var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === "object";
};
var hasChanged = function (newValue, value) {
    return !Object.is(value, newValue);
};

export { extend, hasChanged, hasOwn, isObject };
//# sourceMappingURL=shared.esm.js.map
