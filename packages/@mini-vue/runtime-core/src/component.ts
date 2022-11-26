import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { emit } from "./componentEmit";
import { shallowReadonly } from "@mini-vue/reactivity";

export function createComponentInstance(vNode: any) {
    const component = {
        vNode,
        type: vNode.type,
        setupState: {},
        props: {},
        emit: ()=>{},
        render: ()=>{}
    }

    component.emit = emit.bind(null, component) as any;

    return component;
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vNode.props);
    // initSlots()

    setupStatefulComponent(instance);
}

// 让组件拥有状态
function setupStatefulComponent(instance: any) {
    const Component = instance.type;

    instance.proxy = new Proxy({_:instance}, PublicInstanceProxyHandlers)
    
    const { setup } = Component;

    if(setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });

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