import { h } from "@mini-vue/runtime-core";
import { Foo } from "./Foo";

window.self = null;

export const App = {
    name: "APP",
    setup() {
        return {
            msg: "mini-vue-bai"
        }
    },
    render() {
        window.self = this;
        return h(
            "div", 
            {
                id: "root",
                class: ["red", "hard"],
                // onClick(event: any) {
                //     console.log("click", event);
                // },
                // onMousedown(event: any) {
                //     console.log("onMousedown", event);
                // }
            },
            // setupState
            // this.$el -> get root element
            // "hi, " + this.msg
            // string
            // "hi, mini-vue"
            // array
            [h("p", {class:"red"}, "hi"), h(Foo, { count: 1, onAdd(a, b) {
                console.log("onAdd", a, b);
            },onAddFoo(a, b) {
                console.log("onAddFoo", a, b);
            } })]
        );
    }
}