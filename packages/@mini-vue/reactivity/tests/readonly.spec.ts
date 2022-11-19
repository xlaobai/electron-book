import { readonly, isReadonly } from "../src/index";

describe("readonly", () => {
    it("happy path", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        const observed = readonly(original);
        expect(observed).not.toBe(original);
        expect(isReadonly(observed)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(observed.bar)).toBe(true);
        expect(isReadonly(original.bar)).toBe(false);
        expect(observed.foo).toBe(original.foo);
        expect(isProxy(observed)).toBe(true);
    })

    it("warn then call set", () => {
        console.warn = jest.fn();

        const user = readonly({
            age: 10
        })

        user.age = 11;

        expect(console.warn).toBeCalled();
    })
})