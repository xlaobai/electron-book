export declare const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}
export declare function reactive(original: any): any;
export declare function readonly(original: any): any;
export declare function shallowReadonly(original: any): any;
export declare function isReactive(value: any): boolean;
export declare function isReadonly(value: any): boolean;
export declare function isProxy(value: any): boolean;
