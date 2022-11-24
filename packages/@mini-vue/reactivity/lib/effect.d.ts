export declare class ReactiveEffect {
    scheduler?: any;
    _fn: any;
    _scheduler: any;
    deps: never[];
    active: boolean;
    onStop?: () => void;
    constructor(fn: Function, scheduler?: any);
    run(): any;
    stop(): void;
}
export declare function cleanupEffect(effect: any): void;
export declare function track(target: any, key: any): void;
export declare function trackEffects(dep: any): void;
export declare function triggerEffects(dep: any): void;
export declare function isTracking(): boolean;
export declare function trigger(target: any, key: any): void;
export declare function effect(fn: Function, options?: any): any;
export declare function stop(runner: any): void;
