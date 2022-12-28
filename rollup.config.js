import typescript from "@rollup/plugin-typescript";
// TODO::pkg 引入报错
// TODO::tsconfig配置说明

export default {
    input: "./packages/vue/src/index.ts",
    output: [
        {
            format:"cjs",
            file:"./packages/vue/dist/guide-mini-vue.cjs.js",
        },
        {
            format:"es",
            file:"./packages/vue/dist/guide-mini-vue.esm.js",
        }
    ],
    plugins:[typescript()]
}
