import { h } from "@mini-vue/runtime-core";

export const Foo = {
    name: "Foo",
    setup(props: any, { emit }: any) {
        console.log("props", props);

        const emitAdd = () => {
            emit("add", 1, 2);
            emit("add-foo", 1, 2);
        }

        return {
            emitAdd
        };
    },
    render() {
        const btn = h(
            "button",
            {
                onClick: this.emitAdd
            },
            "emitAdd"
        );
        const foo = h("p", {}, "foo");
        return h("div", {}, [btn, foo]);
    }
}