import { h, renderSlots } from "@mini-vue/runtime-core";

export const Foo = {
    name: "Foo",
    setup() {
        return {}
    },
    render() {
        const foo = h("p", {}, "foo")
        const age = 26;
        return h("div", {}, [renderSlots(this.$slots, "header", {
            age
        }), foo, renderSlots(this.$slots, "footer")]);
    }
}