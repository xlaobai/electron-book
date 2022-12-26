import { ReactiveEffect } from "@guide-mini-vue/reactivity";
import { queuePreFlushCb } from "./scheduler";

/**
 * TODO:: effect & watchEffect & watch 的关系
 * watchEffect 监听依赖收集函数的生命周期
 * @param source 
 * @returns 
 */
export function watchEffect(source: Function) {
    const job = ()=> {
        effect.run();
    }

    // 初始化时不调用用户传递过来的cleanup,只做存储
    // 这个事件的作用主要是给用户在响应后执行自定义函数
    let cleanup;
    const onCleanup = (fn: Function)=> {
        // 当 effect stop 需要执行 cleanup 
        cleanup = (effect.onStop = () => {
            fn();
        });
    }

    // 执行 effect.run 触发
    const getter =()=>{
        cleanup && cleanup();
        source(onCleanup);
    }
    const effect = new ReactiveEffect(getter, ()=>{
        queuePreFlushCb(job);
    })
    effect.run();

    // 只需要返回 stop 即可
    return () => {
        effect.stop();
    };
}