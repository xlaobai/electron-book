import { ShapeFlags } from "@guide-mini-vue/shared";
import { effect } from "@guide-mini-vue/reactivity";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Component, Vnode } from "./types/index";
import { Fragment, TextNode } from "./vnode";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { queueJob } from "./scheduler";

export function createRender(options: any) {
    const { 
        createElement: hostCreateElement, 
        patchProp: hostPatchProp, 
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = options;
    const EMPTY_OBJ = {};

    /**
     * 根据虚拟节点渲染视图
     * @param vnode 虚拟节点
     * @param container 容器
     */
    function render(vnode: Vnode, container: any){
        patch(null, vnode, container, null, null);
    }

    /**
     * 处理渲染的核心方法
     * @param n1 旧虚拟节点
     * @param n2 新虚拟节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function patch(n1: Vnode | null, n2: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        const { shapeFlag, type } = n2;
        switch(type) {
            case Fragment:
                // 仅渲染children元素
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case TextNode:
                // 仅渲染children元素
                processText(n1, n2, container);
                break;
            default:
                // 1、处理element类型
                if(shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor);
                }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
                    // 2、处理组件类型
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
    }

    /**
     * 处理组件渲染
     * @param n1 旧虚拟节点
     * @param n2 新虚拟节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function processComponent(n1: Vnode | null, n2: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        // 1、挂载组件
        if(!n1 || n1 === null) {
            mountComponent(n2, container, parentComponent, anchor);
        } else {
            updateComponent(n1, n2);
        }
    }

    /**
     * 更新组件
     * @param n1 
     * @param n2 
     */
    function updateComponent(n1: Vnode, n2: Vnode) {
        const instance = (n2.component = n1?.component);
        if(shouldUpdateComponent(n1, n2)) {
            instance.next = n2;
            instance.update();
        } else {
          n2.el = n1.el;
          instance.vnode = n2;
        }
    }

    /**
     * 处理组件挂载
     * @param initialVnode 初始化节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function mountComponent(initialVnode: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        // 1、创建组件实例, 赋值给虚拟节点的component属性
        const instance = (initialVnode.component= createComponentInstance(initialVnode, parentComponent));
        // 2、设置组件相关配置
        setupComponent(instance);
        // 3、处理组件渲染
        setupRenderEffect(instance, initialVnode, container, parentComponent, anchor);
    }

    /**
     * 处理组件渲染
     * @param instance 组件实例
     * @param initialVnode 初始化节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function setupRenderEffect(instance: Component, initialVnode: Vnode, container: any, parentComponent:Component | null, anchor) {
        // 绑定依赖的响应函数，主要响应setup的数据变化
        // 实例对象绑定响应式方法
        instance.update = effect(() => {
            // 未挂载，则进行初始化
            const { isMounted } = instance;
            if(!isMounted) {
                // 获取代理对象
                const { proxy } = instance;
                // 1. 获取子节点
                const subTree = (instance.subTree = instance.render.call(proxy, proxy));
                // 2. 渲染子节点
                patch(null, subTree, container, instance, anchor);
                // 3. 所有节点都渲染完成后，绑定下el属性
                initialVnode.el = subTree.el;
                // 4. 标记已挂载
                instance.isMounted = true;
            } else {
                const { proxy, next, vnode } = instance;
                // 0. 如果需要更新的下一个虚拟节点存在，则进行更新
                if(next) {
                    next.el = vnode.el;

                    updateComponentPreRender(instance, next);
                }
                // 1. 获取本次的子节点
                const subTree = instance.render.call(proxy, proxy);
                // 2. 获取上一次的子节点
                const prevSubTree = instance.subTree;
                // 3. 将实列子树进行重新覆盖
                instance.subTree = subTree;
                // 4. 更新节点信息
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        }, {
            scheduler: () => {
                // 把 effect 推到微任务的时候在执行
                queueJob(instance.update);
            },
        })
    }

    /**
     * 更新组件属性，提前渲染
     * @param instance 
     * @param nextVNode 
     */
    function updateComponentPreRender(instance:Component, nextVNode: Vnode) {
        instance.vnode = nextVNode;
        instance.next = null;
        instance.props = nextVNode.props;
    }

    /**
     * 处理元素渲染
     * @param n1 旧虚拟节点
     * @param n2 新虚拟节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function processElement(n1: Vnode | null, n2: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        if(!n1) {
            mountElement(n2, container, parentComponent, anchor);
        } else {
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }

    /**
     * 对比节点进行元素渲染
     * @param n1 旧虚拟节点
     * @param n2 新虚拟节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function patchElement(n1: Vnode | null, n2: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        console.log("prevSubTree", n1);
        console.log("subTree", n2);

        const el = (n2.el = n1?.el);

        // 对比props进行处理
        const prevProps = n1?.props || EMPTY_OBJ;
        const nextProps = n2.props || {};
        patchProps(el, prevProps, nextProps);

        // 对比子节点进行处理
        patchChildren(n1, n2, el, parentComponent, anchor);
    }

    /**
     * 对比子节点进行处理
     * @param n1 元素对应的旧节点
     * @param n2 元素对应的新节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function patchChildren(n1: Vnode | null, n2: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        const prevShapeFlag = n1?.shapeFlag;
        const c1 = n1?.children;
        const nextShapeFlag = n2.shapeFlag;
        const c2 = n2?.children;
        // 新节点为文本节点，旧节点为数组节点
        if(nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // 1. 旧节点存在，则进行删除
            if(prevShapeFlag && (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN)) {
                unmountChildren(n1.children);
            }
            // 2. 设置新的文本节点
            if(c1 !== c2) {
                hostSetElementText(container, c2);
            }
        } else {
            // 新节点为数组节点，旧节点为文本节点
            if(prevShapeFlag && (prevShapeFlag & ShapeFlags.TEXT_CHILDREN)){
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent, anchor);
            } else {
                // 新旧节点都为数组节点
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }

    /**
     * 对比新旧数组节点
     * @param c1 
     * @param c2 
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     * 
     */
    function patchKeyedChildren(c1:any, c2: any, container: any, parentComponent:Component | null, parentAnchor: any) {
        let i = 0;
        let l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        
        function isSomeVNodeType(n1, n2) {
            // 对比type和key
            return n1.type === n2.type && n1.key === n2.key;
        }

        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];

            if(isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }

            i++;
        }

        // 右侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];

            if(isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }

            e1--;
            e2--;
        }

        // 新的比老的长, 创建新的(左右侧)
        if(i > e1) {
            if(i <= e2) {
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        } else if(i > e2) {
            // 新的比老的短，删除(左右侧)
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        } else {
            // 中间对比
            let s1 = i;
            let s2 = i;

            // 申明对比次数
            const toBePatched = e2 - s2 + 1;
            let patched = 0;

            // 最长子序列映射表, 索引为新数组中间部分的排列顺序，值对应的是旧数组索引值 + 1
            // eg: [0: 5, 1: 3,2: 4]
            const newIndexToOldIndexMap = new Array(toBePatched);
            for (let i = 0; i < toBePatched; i++) {
                newIndexToOldIndexMap[i] = 0;                
            }
            
            // 是否需要移动
            let moved = false;
            let maxNewIndexSoFar = 0;

            // TODO::把新的节点通过map进行key存储,常考察
            const keyToNewIndexMap = new Map();
            for (let i = s2; i <= e2; i++) {
                keyToNewIndexMap.set(c2[i].key, i);
            }

            // 对比旧节点
            for (let i = s1; i <= e1; i++) {
                const prevChild = c1[i];

                // 新节点是否对比完
                if(patched >= toBePatched) {
                    hostRemove(prevChild.el);
                    continue;
                }
                
                let newIndex;
                if(prevChild.key !== null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                } else {
                    for (let j = s2; j <= e2; j++) {
                        if(isSomeVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }

                if(newIndex === undefined) {
                    hostRemove(prevChild.el);
                } else {
                    if(newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    } else {
                        moved = true;
                    }

                    newIndexToOldIndexMap[newIndex - s2] = i + 1;
                    patch(prevChild, c2[newIndex], container, parentComponent, null);
                    patched++;
                }
            }

            const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
            let j = increasingNewIndexSequence.length - 1;
            for (let i = toBePatched - 1; i >= 0; i--) {
                const nextIndex = i +s2;
                const nextChild = c2[nextIndex];
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

                if(newIndexToOldIndexMap[i] === 0) {
                    patch(null, nextChild, container, parentComponent, anchor);
                } else if(moved) {
                    if(j < 0 || i !== increasingNewIndexSequence[j]) {
                        console.log("移动位置");
                        hostInsert(nextChild.el, container, anchor);
                    } else {
                        j--;
                    }
                }
            }
        }
    }
    
    /**
     * 循环删除子节点
     * @param children 子节点
     */
    function unmountChildren(children: any) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            hostRemove(el);
        }
    }

    /**
     * patchProps
     * @param el 操作元素
     * @param prevProps 元素对应的旧props
     * @param nextProps 元素对应的新props
     */
    function patchProps(el: any, prevProps: Vnode["props"], nextProps: Vnode["props"]) {
        if(nextProps !== prevProps) {
            for (const key in nextProps) {
                const prevProp = prevProps[key];
                const nextProp = nextProps[key];
                
                // 新的prop不等于旧的prop
                if(nextProp !== prevProp) {
                    hostPatchProp(el, key, nextProp);
                }
            }
    
            if(prevProps !== EMPTY_OBJ) {
                for (const key in prevProps) {
                    // 旧的prop被去除
                    if(!(key in nextProps)) {
                        hostPatchProp(el, key, null);
                    }
                }
            }
        }
    }

    /**
     * 处理元素挂载
     * @param vnode
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function mountElement(vnode: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        createElementByVnode(vnode, container, parentComponent, anchor)
    }

    /**
     * 通过虚拟节点创建真实元素节点
     * @param vnode 虚拟节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function createElementByVnode(vnode: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        const { type, children, props, shapeFlag } = vnode;
        
        // 1、创建元素
        const el = hostCreateElement(type);
        // 绑定元素节点
        vnode.el = el;

        // 2、处理子节点
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // 如果是字符串类型，直接赋值
            el.textContent = children
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // 如果是数组类型，需循环处理
            mountChildren(children, el, parentComponent, anchor);
        }

        // 3、处理props
        for (const key in props) {
            const val = props[key];
            
            hostPatchProp(el, key, val);
        }
        hostInsert(el, container, anchor);
    }


    /**
     * 挂载children
     * @param children 
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function mountChildren(children:Array<any>, container: any, parentComponent:Component | null, anchor: any) {
        children.forEach(v=>{
            patch(null, v, container,parentComponent, anchor);
        })
    }

    /**
     * 仅渲染children
     * @param n1 旧虚拟节点
     * @param n2 新虚拟节点
     * @param container 容器
     * @param parentComponent 父组件
     * @param anchor 插入的索引节点
     */
    function processFragment(n1: Vnode | null, n2: Vnode, container: any, parentComponent:Component | null, anchor: any) {
        mountChildren(n2.children, container, parentComponent, anchor);
    }

    /**
     * 渲染文本节点
     * @param n1 旧虚拟节点
     * @param n2 新虚拟节点
     * @param container 容器
     */
    function processText(n1: Vnode | null, n2: Vnode, container: any) {
        const { children } = n2;
        // 1、创建文本节点
        const textNode = document.createTextNode(children);
        n2.el =textNode;

        // 2、渲染到容器
        container.append(textNode);
    }

    return {
        createApp: createAppAPI(render)
    }
}

/**
 * 最长递增子序列
 * @param arr 
 * @returns 
 */
 function getSequence(arr: number[]): number[] {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
            p[i] = j;
            result.push(i);
            continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
            c = (u + v) >> 1;
            if (arr[result[c]] < arrI) {
            u = c + 1;
            } else {
            v = c;
            }
        }
        if (arrI < arr[result[u]]) {
            if (u > 0) {
            p[i] = result[u - 1];
            }
            result[u] = i;
        }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}