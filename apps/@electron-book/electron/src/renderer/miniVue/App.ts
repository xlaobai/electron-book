import { h } from "@mini-vue/runtime-core";
import { Foo } from "./Foo";

export const App = {
    name: "APP",
    setup() {
        return {}
    },
    render() {
        const app = h("div", {}, "App");
        const foo = h(Foo, {}, {
            header: ({ age }) => h("p", {}, "header" + age), 
            footer: () => h("p", {}, "footer")
        });
        return h("div", {}, [app, foo]);
    }
}