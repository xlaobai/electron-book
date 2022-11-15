import add from "../src/index";

test("1+1 = 2", () => {
    const a = 1;
    const b = 2;
    const result = add(a, b);

    expect(result).toBe(3);
})

// TODO::TS引入vue-test-utils
// 不关注细节,针对组件的输入和输出
// describe("todo", () => {
    // given

    // when

    // then
// })