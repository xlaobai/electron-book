import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vNode: any) {
    const component = {
        vNode,
        type: vNode.type,
        setupState: {},
        render: ()=>{}
    }

    return component;
}

export function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()

    setupStatefulComponent(instance);
}

// 让组件拥有状态
function setupStatefulComponent(instance: any) {
    const Component = instance.type;

    instance.proxy = new Proxy({_:instance}, PublicInstanceProxyHandlers)
    
    const { setup } = Component;

    if(setup) {
        const setupResult = setup();

        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance:any, setupResult:any) {
    // function || object
    if(typeof setupResult === "object") {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type;

    instance.render = Component.render;
}