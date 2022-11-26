export { ShapeFlags } from "./ShapeFlags";
export declare const hasOwn: (obj: any, key: any) => boolean;
export declare const extend: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T_1 extends {}, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2 extends {}, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
export declare const isObject: (val: any) => boolean;
export declare const hasChanged: (newValue: any, value: any) => boolean;
