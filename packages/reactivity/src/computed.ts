import { ReactiveEffect } from "./effect";

class ComputedImpl {
    // 当前的getter是否有被调用过
    private _dirty: boolean = true;
    private _value: any;
    private _effect: ReactiveEffect;
    
    constructor(getter) {
        this._effect = new ReactiveEffect(getter, ()=> {
            // 如果响应式对象的值发生了变化，则会执行该方法
            if(this._dirty) return;
            this._dirty = true
        })
    }

    get value() {
        // 调用完一次之后，先锁定，当数据发生改变时(scheduler调用)，才会重新解锁
        if(this._dirty) {
            this._dirty = false;
            // 执行用户传入的fn，即getter，拿到最新的value
            this._value = this._effect.run();
        }
        return this._value;
    }
}
/**
 * 计算属性
 * @param getter 
 * @returns 
 */
export function  computed(getter){
    return new ComputedImpl(getter)
}