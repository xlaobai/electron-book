import { ShapeFlags } from "@mini-vue/shared/lib/ShapeFlags";

export function createVNode(type, props?, children?) {
    const vNode = {
        type,
        props,  //type=string -> props=attribute; type=object -> props=setupState
        children,
        shapeFlags: getShapeFlags(type),
        el: null
    }

    // children
    if( typeof children === "string") {
        vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
    }

    if( Array.isArray(children) ) {
        vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
    }

    return vNode;
}

function getShapeFlags(type) {
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}