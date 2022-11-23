import { reactive, effect, stop } from "../src/index";

describe("effect", () => {
    it("happy path", () => {
        // 实现依赖收集和触发
        const user = reactive({
            age: 10
        })

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);

        user.age++;
        expect(nextAge).toBe(12);
    })

    it("runner", () => {
        // runner 提供主动触发依赖的方法 
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        })
        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    })

    it("scheduler", () => {
        // scheduler 提供触发依赖时的备用方法
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({
            foo: 1
        });
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            scheduler
        })
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    })

    it("stop", () => {
        // stop 把收集的依赖进行剔除，后续set不触发变化
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        })
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        obj.prop++;
        expect(dummy).toBe(2);

        // runner();
        // expect(dummy).toBe(3);
    })

    it("onStop", () => {
        const obj = reactive({
            foo: 1,
        });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            onStop
        });
        
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})