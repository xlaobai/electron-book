export interface Vnode {
    type: any,
    props: any,
    children: any,
    shapeFlag: number,
    el: any,
    key: string,
    component: any
}

export interface Component {
    vnode: Vnode,
    type: object,
    render: Function,
    proxy: object,
    setupState: object,
    props: any,
    emit: Function,
    update: Function,
    next: Vnode | null,
    slots: object,
    provides: object,
    subTree: Vnode | null,  //子树虚拟节点
    isMounted: boolean, //是否挂载过
    parent: Component | null,
}