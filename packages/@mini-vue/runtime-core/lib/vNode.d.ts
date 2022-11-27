import { ShapeFlags } from "@mini-vue/shared/lib/ShapeFlags";
export declare const Fragment: unique symbol;
export declare const Text: unique symbol;
export declare function createVNode(type: any, props?: any, children?: any): {
    type: any;
    props: any;
    children: any;
    shapeFlags: ShapeFlags;
    el: null;
};
export declare function createTextVNode(str: string): {
    type: any;
    props: any;
    children: any;
    shapeFlags: ShapeFlags;
    el: null;
};
