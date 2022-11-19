import { trackEffects, triggerEffects, isTracking } from "./effect";
import { hasChanged, isObject } from "@mini-vue/shared";
import { reactive } from "./reactive";

// 相对reactive， 主要处理 1 true "1" 等数据

class RefImpl {
    private _value: any;    //响应数据
    private _rawValue: any; //原生数据
    public dep;
    public __v_isRef = true;
    constructor(value: any) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }

    get value() {
        trackRefValue(this);
        return this._value;
    }

    set value(newValue: any) {
        if(hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}

export function ref(value: any) {
    return new RefImpl(value);
}

export function isRef(ref: any) {
    return !!ref.__v_isRef;
}

export function unRef(ref: any) {
    return isRef(ref) ? ref.value : ref;
}

function trackRefValue(ref: RefImpl) {
    if(isTracking()) {
        trackEffects(ref.dep);
    }
}

function convert(value: any) {
    return isObject(value) ? reactive(value) : value;
}

// TODO::应用场景
export function proxyRefs(objectWithRefs: any) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target: any, key: any, value: any) {
            if(isRef( target[key]) && !isRef(value)) {
                return target[key].value = value;
            } else {
                return Reflect.set(target, key, value);
            }
        }
    })
}