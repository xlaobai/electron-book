import { ShapeFlags } from "@mini-vue/shared/lib/ShapeFlags";
import { isObject } from "@mini-vue/shared";

// TODO::Symbol 语法
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createVNode(type, props?, children?) {
    const vNode = {
        type,
        props,  //type=string -> props=attribute; type=object -> props=setupState
        children,
        shapeFlags: getShapeFlags(type),
        el: null
    }

    // string + children
    if( typeof children === "string") {
        vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
    }

    // array + children
    if( Array.isArray(children) ) {
        vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
    }

    // 组件 + object children
    if(vNode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        if(isObject(children)) {
            vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.SLOT_CHILDREN;
        }
    }

    return vNode;
}

export function createTextVNode(str: string) {
    return createVNode(Text, {}, str);
}

function getShapeFlags(type) {
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}