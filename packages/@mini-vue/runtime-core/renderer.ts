import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
    //  patch

    patch(vNode, container);
}

function patch(vNode, container) {
    processComponent(vNode, container);
}

function processComponent(vNode: any, container: any) {
    mountComponent(vNode, container);
}

function mountComponent(vNode: any, container: any) {
    // 获取组件实例
    const instance = createComponentInstance(vNode);
    // 生成组件
    setupComponent(instance);
    setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
    const subTree = instance.render();

    // vNode -> patch
    // vNode -> element -> mountElement
    patch(subTree, container);
}