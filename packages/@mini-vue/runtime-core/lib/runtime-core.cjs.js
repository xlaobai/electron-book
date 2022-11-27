'use strict';

var hasOwn = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };
var isObject$1 = function (val) {
    return val !== null && typeof val === "object";
};
var hasOwn_1 = hasOwn;
var isObject_1$1 = isObject$1;

// TODO::Symbol 语法
var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
function createVNode(type, props, children) {
    var vNode = {
        type: type,
        props: props,
        children: children,
        shapeFlags: getShapeFlags(type),
        el: null
    };
    // string + children
    if (typeof children === "string") {
        vNode.shapeFlags = vNode.shapeFlags | 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    // array + children
    if (Array.isArray(children)) {
        vNode.shapeFlags = vNode.shapeFlags | 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    // 组件 + object children
    if (vNode.shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (isObject_1$1(children)) {
            vNode.shapeFlags = vNode.shapeFlags | 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vNode;
}
function createTextVNode(str) {
    return createVNode(Text, {}, str);
}
function getShapeFlags(type) {
    return typeof type === "string" ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

var publicPropertiesMap = {
    $el: function (i) { return i.vNode.el; },
    $slots: function (i) { return i.slots; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn_1(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn_1(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initProps(instance, rawProps) {
    instance.props = rawProps;
}

function initSlots(instance, children) {
    var vNode = instance.vNode;
    if (vNode.shapeFlags & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    console.log("children", children);
    var _loop_1 = function (key) {
        var slot = children[key];
        slots[key] = function (props) { return normalizeSlotValue(slot(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
    console.log("slots", slots);
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    // TPP 先具体再抽象
    var camelize = function (str) {
        return str.replace(/-(\w)/g, function (_, c) {
            return c ? c.toUpperCase() : '';
        });
    };
    var capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    var handlerKey = function (str) {
        return str ? "on" + capitalize(str) : "";
    };
    var handler = props[handlerKey(camelize(event))];
    handler && handler.apply(void 0, args);
}

var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === "object";
};

var extend_1 = extend;
var isObject_1 = isObject;
var targetMap = new Map();
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, isShallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (isShallow === void 0) { isShallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        if (isShallow) {
            return res;
        }
        if (isObject_1(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key:".concat(key, " is set fail, because target is readonly"));
        return true;
    }
};
var shallowReadonlyHandlers = extend_1({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

function reactive(original) {
    return createActiveObject(original, mutableHandlers);
}
function readonly(original) {
    return createActiveObject(original, readonlyHandlers);
}
function shallowReadonly(original) {
    return createActiveObject(original, shallowReadonlyHandlers);
}
function createActiveObject(raw, baseHandlers) {
    if (!isObject_1(raw)) {
        console.warn("target ".concat(raw, " \u5FC5\u987B\u662F\u4E2A\u5BF9\u8C61"));
        return;
    }
    return new Proxy(raw, baseHandlers);
}
var shallowReadonly_1 = shallowReadonly;

function createComponentInstance(vNode, parent) {
    console.log("createComponentInstance", parent);
    var component = {
        vNode: vNode,
        type: vNode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent: parent,
        emit: function () { },
        render: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vNode.props);
    initSlots(instance, instance.vNode.children);
    setupStatefulComponent(instance);
}
// 让组件拥有状态
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        setCurrentInstance(instance);
        var setupResult = setup(shallowReadonly_1(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
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
var currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function render(vNode, container) {
    patch(vNode, container, null);
}
function patch(vNode, container, parentComponent) {
    var shapeFlags = vNode.shapeFlags, type = vNode.type;
    switch (type) {
        case Fragment:
            mountChildren(vNode.children, container, parentComponent);
            break;
        case Text:
            processText(vNode, container);
            break;
        default:
            if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) {
                processElement(vNode, container, parentComponent);
            }
            else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                processComponent(vNode, container, parentComponent);
            }
            break;
    }
}
function processText(vNode, container) {
    var children = vNode.children;
    var textNode = document.createTextNode(children);
    vNode.el = textNode;
    container.append(textNode);
}
function processElement(vNode, container, parentComponent) {
    mountElement(vNode, container, parentComponent);
}
function processComponent(vNode, container, parentComponent) {
    mountComponent(vNode, container, parentComponent);
}
function mountElement(vNode, container, parentComponent) {
    var el = (vNode.el = document.createElement(vNode.type));
    var children = vNode.children, props = vNode.props, shapeFlags = vNode.shapeFlags;
    // 设置子节点
    if (shapeFlags & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(children, el, parentComponent);
    }
    // 设置属性
    for (var key in props) {
        var val = props[key];
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var eventName = key.slice(2).toLocaleLowerCase();
            el.addEventListener(eventName, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vNode, container, parentComponent) {
    vNode.forEach(function (v) {
        patch(v, container, parentComponent);
    });
}
function mountComponent(initialVNode, container, parentComponent) {
    // 获取组件实例
    var instance = createComponentInstance(initialVNode, parentComponent);
    // 生成有状态的组件实例
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    // 把有状态的组件实例通过 proxy 的方式与子树进行绑定
    var subTree = instance.render.call(proxy);
    // 渲染子树
    patch(subTree, container, instance);
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

function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        if (typeof slot === "function") {
            return createVNode(Fragment, {}, slot(props));
        }
    }
    return {};
}

function provide(key, value) {
    // 存
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = currentInstance.parent.provides;
        // TODO::了解init过程
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // 取
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

exports.createApp = createApp;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlots = renderSlots;
