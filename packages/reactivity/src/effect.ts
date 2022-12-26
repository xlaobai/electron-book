import { extend } from "@guide-mini-vue/shared";

// 需收集依赖的对象集合
const targetMap = new Map();
// 当前正在执行的依赖响应
let activeEffect:any = null;
// 是否应该收集依赖,默认不收集
let shouldTrack:boolean = false;

export class ReactiveEffect {
    private _fn: Function; // 回调方法
    private scheduler: any; 
    deps:Array<any> = []; // 依赖集合
    active: boolean = true; // 是否需要收集依赖
    onStop?: () => void;
    constructor(fn:Function, scheduler?:any) {
        this._fn = fn;
        this.scheduler = scheduler;
    }

    run() {
        // 如果不需要收集依赖，则直接执行fn
        if(!this.active) {
            return this._fn();
        }

        //否则执行fn，进行依赖收集,变更全局变量
        shouldTrack = true;

        //给全局变量赋值，可利用全局变量获取当前的effect
        activeEffect = this;
        //执行fn
        const result = this._fn();
        //执行完后重置下当前的可收集状态的值
        shouldTrack = false;
        activeEffect = null;
        
        return result;
    }

    stop() {
        if(this.active){
            // 清除依赖
            clearUpEffect(this);
            // 如果有stop，则执行
            if(this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }

}

/**
 * 清除依赖
 * @param effect 依赖集合
 */
function clearUpEffect(effect) {
    effect.deps.forEach((dep:any)=>{
        dep.delete(effect);
    })
}

/**
 * 收集依赖
 * @param target 
 * @param key 
 */
export function track(target:object, key:string|symbol) {
    // 如果当前依赖不需要收集，则直接返回
    if(!isTracking()) return;

    // 获取对象依赖收集的容器
    let depsMap = targetMap.get(target);
    // 如果没有对象依赖收集的容器，则创建一个
    if(!depsMap){
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    // 获取当前对象属性依赖收集的容器
    let dep = depsMap.get(key);
    // 如果当前对象属性还没有收集依赖，则立即收集
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    // 执行收集依赖
    trackEffects(dep);
}

/**
 * 执行收集依赖的动作
 * @param dep 
 */
export function trackEffects(dep: Set<any>) {
    // 收集依赖前先判断下是否已经收集了，防止重复收集
    if(!dep.has(activeEffect)){
        dep.add(activeEffect);
        // 方便根据effect找到dep，需要先收集一下
        activeEffect.deps.push(dep);
    }
}

/**
 * 触发依赖
 * @param target 
 * @param key 
 * @param value 
 */
export function trigger(target:object, key:string|symbol) {
    // 获取到当前对象依赖收集的容器
    const depsMap = targetMap.get(target);
    // 获取当前对象属性依赖收集的容器
    const dep = depsMap.get(key);
    // 执行触发依赖
    triggerEffects(dep);
}

/**
 * 执行触发依赖动作
 * @param dep 
 */
export function triggerEffects(dep) {
    // 触发更新
    for (const effect of dep) {
        if(effect.scheduler){
            effect.scheduler();
        }else{
            effect.run();
        }
    }
}

export function stop(runner:any) {
    runner.effect.stop();
}

/**
 * 依赖响应
 * @param fn 
 * @param options 额外参数
 */
export function effect(fn:Function, options:any = {}){
    const _effet = new ReactiveEffect(fn, options.scheduler);
    // 处理额外参数
    extend(_effet, options);
    // 立即执行函数
    _effet.run();

    const runner:any = _effet.run.bind(_effet);
    runner.effect = _effet;

    return runner;
}

/**
 * 是否需要收集依赖
 * @returns 
 */
export function isTracking() {
    return shouldTrack && activeEffect;
}