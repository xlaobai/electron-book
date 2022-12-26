import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transforms/transformExpression";
import { transformElement } from "../src/transforms/transformElement";
import { transformText } from "../src/transforms/transformText";

describe("codegen", () => {
  it('string', () => {
    const ast = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  })

  it("interpolation module", () => {
    const ast = baseParse("{{hello}}");  
    transform(ast, {
      nodeTransforms: [transformExpression]
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("element and interpolation", () => {
    const ast: any = baseParse("<div>hi, {{message}}</div>");
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    
    console.log("ast-------", ast);
    console.log("codegenNode-------", ast.codegenNode.children);
  
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
})
