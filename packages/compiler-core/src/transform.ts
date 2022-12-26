import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
    // 创建 context
    const context = createTransformContext(root, options);

    // 遍历 node
    traverseNode(root, context);

    // 创建 codegen入口
    createRootCodegen(root);  

    // 设置helpers数组
    root.helpers = [...context.helpers.keys()];
}

function createRootCodegen(node: any) {
    const child = node.children[0];
    if(child.type === NodeTypes.ELEMENT) {
        node.codegenNode = child.codegenNode;
    } else {
        node.codegenNode = child;
    }
}

function traverseNode(node: any, context) {
    const type: NodeTypes = node.type;

    // 遍历调用所有的 nodeTransforms
    // 把 node 给到 transform
    const nodeTransforms = context.nodeTransforms;
    const exitFns: any = [];
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i];
        const onExit = transform(node, context);
        if(onExit) exitFns.push(onExit);
    }

    switch (type) {
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING);
            break;
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            const children = node.children;
            for (let index = 0; index < children.length; index++) {
                const node = children[index];
                traverseNode(node, context);
            }
            break;
        default:
            break;
    }

    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}

function createTransformContext(root, options): any {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper: (key) => {
            context.helpers.set(key, 1);
        }
    };

    return context;
}

