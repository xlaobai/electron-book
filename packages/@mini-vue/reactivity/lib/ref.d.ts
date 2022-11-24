declare class RefImpl {
    private _value;
    private _rawValue;
    dep: any;
    __v_isRef: boolean;
    constructor(value: any);
    get value(): any;
    set value(newValue: any);
}
export declare function ref(value: any): RefImpl;
export declare function isRef(ref: any): boolean;
export declare function unRef(ref: any): any;
export declare function proxyRefs(objectWithRefs: any): any;
export {};
