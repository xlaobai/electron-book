import { track, trigger } from "./effect";
import { reactive, readonly, ReactiveFlags } from "./reactive";
import { isObject, extend } from "@mini-vue/shared";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly: Boolean = false, isShallow = false) {
    return function get(target: any, key: any){
        if(key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if(key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        const res = Reflect.get(target, key);

        if(isShallow) {
            return res;
        }

        if(isObject(res)) {
            return isReadonly ? readonly(res): reactive(res);
        }

        // 收集依赖
        if(!isReadonly) {
            track(target, key);
        }
        return res;
    }
}

function createSetter() {
    return function set(target: any, key: any, value: any) {
        const res = Reflect.set(target, key, value)

        trigger(target, key);
        return res;
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target: any, key: any, value: any) {
        console.warn(`key:${key} is set fail, because target is readonly`);
        return true;
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})