import { Vnode } from "./types/index";

export function shouldUpdateComponent(prevVNode: Vnode, nextVNode: Vnode) {
    const { props: prevProps } = prevVNode;
    const { props: nextProps } = nextVNode;

    for (const key in nextProps) {
        if(nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}