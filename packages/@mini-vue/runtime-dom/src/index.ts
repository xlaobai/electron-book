import { createRenderer } from "@mini-vue/runtime-core/lib/runtime-core.esm.js";

function createElement(type) {
    return document.createElement(type);
}

function patchProp(el, key, val) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if(isOn(key)) {
        const eventName = key.slice(2).toLocaleLowerCase();
        el.addEventListener(eventName, val);
    } else {
        el.setAttribute(key, val);
    }
}

function insert(el, parent) {
    parent.append(el);
}

const renderer = createRenderer({
    createElement,
    patchProp,
    insert
})

console.log("renderer", renderer);

export function createApp(...arg) {
    return renderer.createApp(...arg);
}