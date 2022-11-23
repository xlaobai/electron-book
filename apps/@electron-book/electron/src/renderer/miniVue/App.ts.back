import { reactivity, h } from "./core/main";
declare const window:Window & {obj:any, h:any}

export default {
    // ui
    render(context: any) {
        // return h("div", {id: "foo", class: "test"}, [
        //     h("p", {}, "hello"),
        //     h("p", {}, context.count)
        // ]);
        
        // 测试tag-diff
        // return h(context.tag, {}, "hello");

        // 测试props-diff
        // return h(context.tag, context.props, "hello");

        // 测试children-diff
        // 1. new -> string old -> string
        // return h(context.tag, context.props, context.children);
        // 2. new -> string old -> array
        // return h(context.tag, context.props, context.children);
        // 3. new -> array old -> string
        // return h(context.tag, context.props, context.children);
        // 4. new -> array old -> array(暴力算法)
        return h(context.tag, context.props, context.children);
    },
    setup() {
        const obj = reactivity({
            count: 0,
            tag: "div",
            props: {
                a: "a"
            },
            children: [
                h("p", {}, "hi"),
                h("div", {}, "hello"),
                h("text", {}, "888"),
            ]
        })

        window.obj = obj;
        window.h = h;
        return obj;
    }
}