import { extend } from "@mini-vue/shared";

let activeEffect:any;
let shouldTrack = false;

class ReactiveEffect{
    _fn;
    _scheduler;
    deps = [];
    active = true;
    onStop?:() => void;
    constructor(fn: Function, public scheduler?: any) {
        this._fn = fn;
        this._scheduler = scheduler;
    }

    run() {
        if(!this.active) {
            return  this._fn();
        }

        shouldTrack = true;
        activeEffect = this;

        const result = this._fn();
        shouldTrack = false;
        return result;
    }

    stop() {
        if(this.active) {
            cleanupEffect(this);
            if(this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}

export function cleanupEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target: any, key: any) {
    if(!isTracking()) return;

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

    trackEffects(dep);
}

export function trackEffects(dep: any) {
    if(dep.has(activeEffect)) return;
    
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

export function triggerEffects(dep: any) {
    for (const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

export function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}

export function trigger(target: any, key: any) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    triggerEffects(dep);
}

export function effect(fn: Function, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);

    extend(_effect, options);

    _effect.run();

    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect
    return runner;
}

export function stop(runner:any) {
    runner.effect.stop();
}