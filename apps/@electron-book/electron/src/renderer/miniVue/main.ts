import add from "@mini-vue/reactivity";
console.log("add", add(1, 6));
import { Dep, effectWatch, reactivity, createApp } from "./core/main";
import App from "./App";
/**
 * Dep & effectWatch
 */
// const a = new Dep(10);
// let b = 0;

// effectWatch(() => {
//     b = a.value + 10;   //收集依赖
//     console.log(b);
// });

// // 触发的依赖
// a.value = 20;

/**
 * reactive
 */
// const user = reactivity({
//     age: 10,
// })

// let nextAge = 0;
// effectWatch(() => {
//     nextAge = user.age + 1;
//     console.log("effectWatch", nextAge);
// })

// user.age++;


/**
 * mini-vue
 */
createApp(App).mount("#app");