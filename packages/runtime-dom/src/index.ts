import { createRender } from "../runtime-core/index"
import { isEventName } from "../../utils/index";
import { Vnode } from "../runtime-core/types/index";

function createElement(type: string) {
    return document.createElement(type);
}

/**
 * 对比属性进行设置
 * @param el 操作元素
 * @param key 元素属性key
 * @param nextProp 元素对应的新prop
 */
function patchProp(el: any, key: string, nextProp: Vnode["props"]) {
    // 判断当前是否是事件绑定
    const eventName = isEventName(key);
    if(eventName) {
        el.addEventListener(eventName, nextProp);
    }else {
        // 传入的新prop为null 或者 undefined，则删除元素
        if(!nextProp || nextProp === null) {
            el.removeAttribute(key);
        } else {
            el.setAttribute(key, nextProp);
        }
    }
}

/**
 * 插入子节点
 * @param children 
 * @param parent 
 */
function insert(children: any, parent:any, anchor: any) {
    parent.insertBefore(children, anchor || null)
}

/**
 * 删除子节点
 * @param children
 */
function remove(children: any) {
    const parent = children.parentNode;
    if(parent) {
        parent.removeChild(children);
    }
}

/**
 * 设置文本节点
 * @param el 
 * @param text 
 */
function setElementText(el: any, text: Text) {
    el.textContent = text;
}

const render = createRender({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args: any) {
    return render.createApp(args[0]);
}

export * from "../runtime-core/index";