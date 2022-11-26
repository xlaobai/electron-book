import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "@mini-vue/shared/lib/ShapeFlags";

export function render(vNode, container) {
    patch(vNode, container);
}

function patch(vNode, container) {
    const { shapeFlags } = vNode;

    if(shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vNode, container);
    } else if(shapeFlags & ShapeFlags.STATEFUL_COMPONENT){
        processComponent(vNode, container);
    }
}

function processElement(vNode: any, container: any) {
    mountElement(vNode, container);
}

function processComponent(vNode: any, container: any) {
    mountComponent(vNode, container);
}

function mountElement(vNode: any, container: any) {
    const el = (vNode.el = document.createElement(vNode.type));

    const { children, props, shapeFlags } = vNode;

    // 设置子节点
    if(shapeFlags & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if(shapeFlags & ShapeFlags.ARRAY_CHILDREN){
        mountChildren(children, el);
    }

    // 设置属性
    for (const key in props) {
        const val = props[key];
        const isOn = (key: string) => /^on[A-Z]/.test(key);
        if(isOn(key)) {
            const eventName = key.slice(2).toLocaleLowerCase();
            el.addEventListener(eventName, val);
        } else {
            el.setAttribute(key, val);
        }
    }

    container.append(el);
}

function mountChildren(vNode: any, container: any) {
    vNode.forEach((v) => {
        patch(v, container);
    })
}

function mountComponent(initialVNode: any, container: any) {
    // 获取组件实例
    const instance = createComponentInstance(initialVNode);
    // 生成有状态的组件实例
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    const { proxy } = instance;
    // 把有状态的组件实例通过 proxy 的方式与子树进行绑定
    const subTree = instance.render.call(proxy);

    // 渲染子树
    patch(subTree, container);

    // 把绑定子树的el节点绑定给组件实例的虚拟节点
    initialVNode.el = subTree.el;
}