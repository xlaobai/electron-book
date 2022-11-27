import { h, getCurrentInstance, createTextVNode } from "@mini-vue/runtime-core";
import { Foo } from "./Foo";

export const App = {
    name: "APP",
    setup() {
        const instance = getCurrentInstance();
        console.log("APP", instance);
    },
    render() {
        const app = h("div", {}, "App");
        const foo = h(Foo, {}, {
            header: ({ age }) => [h("p", {}, "header" + age), createTextVNode("hello world")], 
            footer: () => h("p", {}, "footer")
        });
        return h("div", {}, [app, foo]);
    }
}