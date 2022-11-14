function createElement(tag: string):Element {
    return document.createElement(tag);
}

function patchProps(el:Element, key: string, prevValue:any, nextValue:any) {
    if(nextValue === null) {
        el.removeAttribute(key);
    } else {
        el.setAttribute(key, nextValue);
    }
}

function insert(el:Element | Text, parent: Element) {
    parent.append(el);
}

function remove(el: Element, parent: Element) {
    parent.removeChild(el);
}


function createTextNode(text: String): Text {
    return document.createTextNode(`${text}`);
}

export function mountElement(vNode: any, container: Element) {
    const { tag, props, children } = vNode;
    
    // 创建节点
    const el = vNode.el = createElement(tag);

    // 设置属性
    for (const key in props) {
        const val = props[key];
        patchProps(el, key, null, val);
    }

    // 生产子节点
    if(typeof children === "string" || typeof children === "number") {
        insert(createTextNode(String(children)), el);
    } else if(Array.isArray(children)) {
        children.forEach(v => {
            mountElement(v, el);
        })
    }

    // 插入节点
    insert(el, container);
}

// n1 -> oldVNode
// n2 -> newVNode
export function diff(n1: any, n2: any) {
    //1. tag
    if(n1.tag !== n2.tag) {
        n1.el.replaceWith(createElement(n2.tag));
    } else {    
        //2. props
        let oldProps = n1.props;
        let newProps = n2.props;
        const el = n2.el = n1.el;
        // 新的属性覆盖或新增
        if(newProps) {
            for (const key in newProps) {
                if(newProps[key] !== oldProps[key]) {
                    patchProps(el, key, oldProps[key], newProps[key]);
                }
            }
        }

        // 旧的属性被移除
        if(oldProps) {
            for (const key in oldProps) {
                if(!newProps[key]) {
                    patchProps(el, key, oldProps[key], null);
                }
            }
        }

        //  TODO::3. children
        // 1. n2 -> string n1 -> string
        // 2. n2 -> string n1 -> array
        // 3. n2 -> array n1 -> string
        // 4. n2 -> array n1 -> array(暴力算法)
        let oldChildren = n1.children;
        let newChildren = n2.children;
        if(typeof newChildren === "string" ) {
            if(typeof oldChildren === "string") {
                if(oldChildren !== newChildren) {
                    el.innerText = newChildren;
                }
            } else if(Array.isArray(oldChildren)){
                el.innerText = newChildren;
            }
        } else if(Array.isArray(newChildren)) {
            if(typeof oldChildren === "string") {
                el.innerText = ``;
                newChildren.forEach(v => {
                    mountElement(v, el);
                })
            } else if(Array.isArray(oldChildren)){
                const length:number = Math.min(newChildren.length, oldChildren.length);
                // 1. 依次对比
                // new -> [a, b, c]
                // old -> [a, b, c]
                for (let i = 0; i < length; i++) {
                    const newVNode = newChildren[i];
                    const oldVNode = oldChildren[i];
                    diff(oldVNode, newVNode);                    
                }

                // 2. new > old -> add
                // new -> [a, b, c]
                // old -> [a, b]
                if(newChildren.length > length) {
                    for (let i = length; i < newChildren.length; i++) {
                        const vNode = newChildren[i];
                        mountElement(vNode, el);
                    }
                }

                // 3. new < old -> remove
                // new -> [a, b]
                // old -> [a, b, c]
                if(newChildren.length < length) {
                    for (let i = length; i < oldChildren.length; i++) {
                        const vNode = oldChildren[i];
                        remove(vNode.el, el);
                    }
                }
            }
        }
    }
}