export declare const mutableHandlers: {
    get: (target: any, key: any) => any;
    set: (target: any, key: any, value: any) => boolean;
};
export declare const readonlyHandlers: {
    get: (target: any, key: any) => any;
    set(target: any, key: any, value: any): boolean;
};
export declare const shallowReadonlyHandlers: any;
