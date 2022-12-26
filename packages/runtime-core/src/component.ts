import { shallowReadonly, proxyRefs } from "@guide-mini-vue/reactivity";
import { emit } from "./componentEmit";
import { initProps } from "./componentPorps";
import { initSlots } from "./componentSlots";
import { componentPublicInstance } from "./componentPublicInstance";
import { Component, Vnode } from "./types/index";

// 当前组件实例对象
let currentInstance: Component | null = null;

/**
 * 创建组件实例
 * @param vnode 虚拟节点 
 */
export function createComponentInstance(vnode: Vnode, parent: Component | null) {
    const component: Component = {
        vnode,
        type: vnode.type,
        render: ()=>{},
        proxy: {},
        setupState: {},
        props: {},
        emit: ()=>{},
        update: ()=>{},
        next: null,
        slots: {},
        provides: parent ? parent.provides : {},
        subTree: null,
        isMounted: false,
        parent,
    }

    component.emit = emit.bind(null, component);
    return component;
}

/**
 * 设置组件实例
 * @param instance 组件实例
 */
export function setupComponent(instance: Component) {
    const { props, children } = instance.vnode;
    // 1、初始化参数props
    initProps(instance, props);
    // 2、初始化插槽slots
    initSlots(instance, children);
    // 3、设置组件setup的状态值
    setupStatefulComponent(instance);
}

/**
 * 获取当前组件实例，给外部使用
 * @returns 
 */
export function getCurrentInstance() {
    return currentInstance;
}


/**
 * 设置组件setup的状态值
 * @param instance 组件实例
 */
function setupStatefulComponent(instance: Component) {
    // 1、获取组件类型
    const component: any =instance.type;

    // 2、把组件实例进行响应式化
    instance.proxy = new Proxy({_instance: instance},componentPublicInstance);

    // 3、从组件中拿到setup
    const { setup } = component;

    if(setup) {
        setCurrentInstance(instance);
        // 把父级的props传递过去
        const setupRes = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
        // 处理返回结果
        handleSetupResult(instance, setupRes);
    }
}

/**
 * 处理setup返回结果
 * @param instance 组件实例
 * @param setupRes setup返回结果 object | function
 */
function handleSetupResult(instance: Component, setupRes: object | Function) {
    if(typeof setupRes === "object"){
        // 把setup方法返回的数据对象进行响应式处理，注入到组件实例
        instance.setupState = proxyRefs(setupRes);
    }

    // 完成组件的设置
    finishComponentSetup(instance);
}

/**
 * 完成组件的创建
 * @param instance 组件实例
 */
function finishComponentSetup(instance: Component) {
    // 拿到组件实例
    const component: any = instance.type;

    if(compiler && !component.render) {
        if(component.template) {
            component.render = compiler(component.template);
        }
    }

    // 如果有渲染方法，则绑定到组件实例
    instance.render = component.render;
}

/**
 * 设置当前组件实例
 * @param instance 
 */
function setCurrentInstance(instance: Component | null) {
    currentInstance = instance;
}

let compiler;

export function registerRuntimeCompiler(_compiler) {
    compiler = _compiler;
}