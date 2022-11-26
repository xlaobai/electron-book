import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";
import { isObject } from "@mini-vue/shared";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}

export function reactive(original:any) {
    return createActiveObject(original, mutableHandlers);
}

export function readonly(original:any) {
    return createActiveObject(original, readonlyHandlers);
}

export function shallowReadonly(original: any) {
    return createActiveObject(original, shallowReadonlyHandlers);
}

function createActiveObject(raw: any, baseHandlers: any) {
    if(!isObject(raw)) {
        console.warn(`target ${raw} 必须是个对象`);
        return;
    }
    return new Proxy(raw, baseHandlers);
}

export function isReactive(value: any) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any) {
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value: any) {
    return isReadonly(value) || isReactive(value);
}