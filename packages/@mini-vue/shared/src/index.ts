export const extend = Object.assign;

export const isObject = (val: any) => {
    return val !== null && typeof val === "object";
}

export const hasChanged = (newValue, value) => {
    return !Object.is(value, newValue)
}