var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === "object";
};
var hasChanged = function (newValue, value) {
    return !Object.is(value, newValue);
};

export { extend, hasChanged, isObject };
//# sourceMappingURL=shared.esm.js.map
