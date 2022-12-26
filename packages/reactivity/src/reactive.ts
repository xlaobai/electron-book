import { isObject } from "@guide-mini-vue/shared";
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

// 【常量】是否是proxy
export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

/**
 * 收集依赖
 * @param raw 需要收集依赖的对象
 * @returns 代理对象
 */
export function reactive(raw:object){
    return createActiveObject(raw, mutableHandlers);
}

/**
 * 只读
 * @param raw 
 */
export function readonly(raw:object) {
    return createActiveObject(raw, readonlyHandlers);
}

export function  shallowReadonly(raw:object) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

/**
 * 创建Proxy对象
 * @param raw 
 * @param baseHandlers 
 * @returns 
 */
function createActiveObject(raw:object, baseHandlers:object) {
    if(!isObject(raw)) {
        return console.warn("createActiveObject only accept object type !!!")
    }
    return new Proxy(raw, baseHandlers)
}

/**
 * 是否是响应对象
 * @param value 
 * @returns 
 */
export function isReactive(value:any) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

/**
 * 是否是只读
 * @param value 
 * @returns 
 */
export function isReadonly(value:any) {
    return !!value[ReactiveFlags.IS_READONLY];
}

/**
 * 是否是一个reactive或者readonly创建的对象
 * @param value 
 */
export function isProxy(value:any) {
    return isReactive(value) || isReadonly(value);
}