// 建立响应式对象
export class Dep {
    _val;
    effects;

    constructor(value?: any) {
        this._val = value;
        this.effects = new Set();
    }
    
    public get value() : any {
        this.depend();
        return this._val;
    }
    
    public set value(v : any) {
        this._val = v;
        this.notice();
    }

    // 依赖收集
    depend() {
        // console.log("depend", currentEffect);
        if(currentEffect !== null) {
            this.effects.add(currentEffect);
        }
        // console.log("depend", this.effects);
    }

    // 触发收集的依赖
    notice() {
        this.effects.forEach(effect => {
            if(typeof effect === "function") {
                effect();
            }
        })
    }
}

let currentEffect: Function | null = null;

// 通过effectWatch方法, 把函数和响应式对象进行绑定
export function effectWatch(fn: Function) {
    currentEffect = fn;
    fn();
    currentEffect = null;
}

const targetsMap = new Map();

// TODO::理解获取依赖的过程
function getDep(raw: any, key: any): Dep {
    let depsMap = targetsMap.get(raw);
    if(!depsMap) {
        depsMap = new Map();
        targetsMap.set(raw, depsMap);
    }

    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }

    return dep;
}

export function reactivity(raw: any) {
    return new Proxy(raw, {
        get(target, key) {
            let dep = getDep(raw, key);
            dep.depend();
            return Reflect.get(target, key);
        },

        set(target, key, value) {
            let dep = getDep(target, key);
            const result = Reflect.set(target, key, value);
            dep.notice();
            return result;
        }
    })
}