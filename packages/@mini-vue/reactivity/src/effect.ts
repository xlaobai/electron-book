let activeEffect:any;
class ReactiveEffect{
    _fn;
    _scheduler;
    constructor(fn: Function, public scheduler?: any) {
        this._fn = fn;
        this._scheduler = scheduler;
    }

    run() {
        activeEffect = this;
        return this._fn();
    }
}

const targetMap = new Map();
export function track(target: any, key: any) {
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect);
}

export function trigger(target: any, key: any) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    for (const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

export function effect(fn: Function, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();

    const runner = _effect.run.bind(_effect);

    return runner;
}