import { App } from "./App";
import { createApp } from "@mini-vue/runtime-core";

/**
 * mini-vue
 */
const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);