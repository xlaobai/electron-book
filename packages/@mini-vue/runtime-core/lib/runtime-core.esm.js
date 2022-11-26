function createVNode(type, props, children) {
    var vNode = {
        type: type,
        props: props,
        children: children,
        el: null
    };
    return vNode;
}

var publicPropertiesMap = {
    $el: function (i) { return i.vNode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vNode) {
    var component = {
        vNode: vNode,
        type: vNode.type,
        setupState: {},
        render: function () { }
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
// 让组件拥有状态
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function || object
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    instance.render = Component.render;
}

function render(vNode, container) {
    patch(vNode, container);
}
function patch(vNode, container) {
    //  TODO::判断vNode是不是一个element
    if (typeof vNode.type === "string") {
        processElement(vNode, container);
    }
    else {
        processComponent(vNode, container);
    }
}
function processElement(vNode, container) {
    mountElement(vNode, container);
}
function processComponent(vNode, container) {
    mountComponent(vNode, container);
}
function mountElement(vNode, container) {
    var el = (vNode.el = document.createElement(vNode.type));
    var children = vNode.children, props = vNode.props;
    // 设置子节点
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    // 设置属性
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vNode, container) {
    vNode.forEach(function (v) {
        patch(v, container);
    });
}
function mountComponent(initialVNode, container) {
    // 获取组件实例
    var instance = createComponentInstance(initialVNode);
    // 生成有状态的组件实例
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    // 把有状态的组件实例通过 proxy 的方式与子树进行绑定
    var subTree = instance.render.call(proxy);
    // 渲染子树
    patch(subTree, container);
    // 把绑定子树的el节点绑定给组件实例的虚拟节点
    initialVNode.el = subTree.el;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 先vNode
            // component -》vNode
            // 所有的操作都基于虚拟节点
            var vNode = createVNode(rootComponent);
            render(vNode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
