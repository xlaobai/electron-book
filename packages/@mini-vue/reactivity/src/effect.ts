let activeEffect:any;
class ReactiveEffect{
    _fn;
    _scheduler;
    stopActive = true;
    deps = [];
    constructor(fn: Function, public scheduler?: any) {
        this._fn = fn;
        this._scheduler = scheduler;
    }

    run() {
        activeEffect = this;
        return this._fn();
    }

    stop() {
        if(this.stopActive) {
            // 清楚依赖
            cleanupEffect(this);
            this.stopActive = false;
        }
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
    activeEffect.deps.push(dep);
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

    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner: any) {
    return runner.effect.stop();
}

export function cleanupEffect(effect: ReactiveEffect) {
    effect.deps.forEach((dep: Set<ReactiveEffect>) => {
        dep.delete(effect);
    })
    effect.deps.length = 0;
}