import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
    patch(vNode, container);
}

function patch(vNode, container) {
    //  TODO::判断vNode是不是一个element
    if(typeof vNode.type === "string") {
        processElement(vNode, container);
    } else {
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

    const { children, props } = vNode;

    // 设置子节点
    if(typeof children === "string") {
        el.textContent = children;
    } else if(Array.isArray(children)){
        mountChildren(children, el);
    }

    // 设置属性
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
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