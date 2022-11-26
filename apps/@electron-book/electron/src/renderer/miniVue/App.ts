import { h } from "@mini-vue/runtime-core";

window.self = null;

export const App = {
    render() {
        window.self = this;
        return h(
            "div", 
            {
                id: "root",
                class: ["red", "hard"]
            },
            // setupState
            // this.$el -> get root element
            "hi, " + this.msg
            // string
            // "hi, mini-vue"
            // array
            // [h("p", {class:"red"}, "hi"), h("p", {class:"blue"}, "mini-vue")]
        );
    },

    setup() {
        return {
            msg: "mini-vue-bai"
        }
    }
}