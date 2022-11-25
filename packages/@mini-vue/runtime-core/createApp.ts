import { createVNode } from "./vNode";
import { render } from "./renderer";

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先vNode
            // component -》vNode
            // 所有的操作都基于虚拟节点
            const vNode = createVNode(rootContainer);

            render(vNode, rootContainer);
        }
    }
}