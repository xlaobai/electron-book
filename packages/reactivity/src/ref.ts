import { hasChanged, isObject } from "@guide-mini-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    private _rawValue: any;
    public dep: Set<any>;
    public __v_isRef: boolean = true;
    constructor(value) {
        // 原始值保存
        this._rawValue = value;
        // 如果当前传过来的值是对象，则需要使用reactive转换
        this._value = convert(value);
        this.dep = new Set();
    }

    get value() {
        // 收集依赖
        trackRefValue(this);
        return this._value;
    }

    set value(newVal) {
        //如果新值和旧值不相等，才进行变更
        if(hasChanged(newVal, this._rawValue)) {
            // 保存下原始值
            this._rawValue = newVal;
            // 先去修改值
            this._value = convert(newVal);
            triggerEffects(this.dep);
        }
    }
}

/**
 * 值转换，如果是普通类型，则直接返回，如果是对象，则需要使用reactive包裹下
 * @param value 
 */
function convert(value: any) {
    return isObject(value) ? reactive(value) : value
}

/**
 * 执行收集依赖
 * @param ref 
 */
function trackRefValue(ref: any) {
    if(isTracking()){
        trackEffects(ref.dep);
    }
}

/**
 * 收集依赖
 * @param value 
 */
export function ref(value: any) {
    return new RefImpl(value);
}

/**
 * 是否是ref对象
 * @param value 
 */
export function isRef(value: any) {
    return !!(value && value.__v_isRef);
}

/**
 * 返回ref的值
 * @param ref 
 */
export function unRef(ref: any) {
    return isRef(ref) ? ref.value : ref;
}

/**
 * 不需要带value返回值
 * @param objectWithRefs 包含reactive\ref\普通对象
 */
export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            const oldValue = target[key];
            // 如果新传入的值是不是一个ref类型，而旧值是一个ref类型
            if(isRef(oldValue) && !isRef(value)) {
                return oldValue.value = value;
            }else {
                return Reflect.set(target, key, value)
            }
        }
    })
}