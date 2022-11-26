import { ShapeFlags } from "@mini-vue/shared/lib/ShapeFlags";

export function initSlots(instance, children) {
    const { vNode } = instance;
    if(vNode.shapeFlags & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children, instance.slots)
    }
}
 
function normalizeObjectSlots(children, slots) {
    console.log("children", children);
    for (const key in children) {
        const slot = children[key];
        slots[key] = (props) => normalizeSlotValue(slot(props));
    }
    console.log("slots", slots);
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}