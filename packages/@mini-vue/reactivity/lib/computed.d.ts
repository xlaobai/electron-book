declare class ComputedRefImpl {
    private _getter;
    private _dirty;
    private _value;
    private _effect;
    constructor(getter: any);
    get value(): any;
}
export declare function computed(getter: any): ComputedRefImpl;
export {};
