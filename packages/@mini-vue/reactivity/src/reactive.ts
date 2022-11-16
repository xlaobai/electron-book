export function reactive(original:any) {
    return new Proxy(original, {
        get(target, key){
            const res = Reflect.get(target, key);

            // 收集依赖
            return res;
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value)

            return res;
        }
    })
}