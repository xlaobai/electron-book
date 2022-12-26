import { isString } from "../../../utils/index";
import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING, helperNameMap, CREATE_ELEMENT_VNODE } from "./runtimeHelpers";

export function generate(ast: any) {
    const context = createCodegenContext();
    const { push } = context;

    genFunctionPreamble(ast, context);

    const functionName = "render";
    const args = ["_ctx", "_cache"];
    const signature = args.join(", ");

    push(`function ${functionName}(${signature}){`);

    push("return ");
    genNode(ast.codegenNode, context);
    push("}");

    return {
        code: context.code
    }
}

function genFunctionPreamble(ast: any, context: any) {
    const { push } = context;
    const VueBinging = "Vue";
    const aliasHelper = (s) => `${helperNameMap[s]} : _${helperNameMap[s]}`;
    if(ast.helpers.length > 0) {
        push(`const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`);
    }
    push("\n");
    push("return ");
}

function createCodegenContext() {
    const context = {
        code: "",
        push(source) {
            context.code += source;
        },
        helper(key) {
            return `_${helperNameMap[key]}`;
        },
    }

    return context;
}

function genNode(node: any, context: any) {
    switch (node.type) {
        case NodeTypes.TEXT:
            const { push } = context;
            push(`'${node.content}'`);
            break;
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context);
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context);
            break;
        case NodeTypes.ELEMENT:
            genElement(node, context);
            break;
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompoundExpression(node, context);
            break;
        default:
            break;
    }
}

function genCompoundExpression(node: any, context: any) {
    const { push } = context;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (isString(child)) {
        push(child);
      } else {
        genNode(child, context);
      }
    }
  }

function genInterpolation(node: any, context: any) {
    const { push, helper } = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(")");
}

function genExpression(node: any, context: any) {
    const { push } = context;
    push(`${node.content}`);
}

function genElement(node: any, context: any) {
    const { push, helper } = context;
    const { tag, children, props } = node;
    push(`${helper(CREATE_ELEMENT_VNODE)}(`);
    genNodeList(genNullableArgs([tag, props, children]), context);
    push(")");
}

function genNodeList(nodes: any, context: any) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
  
      if (isString(node)) {
        push(`${node}`);
      } else {
        genNode(node, context);
      }
      if (i < nodes.length - 1) {
        push(", ");
      }
    }
  }
  
  function genNullableArgs(args) {
    let i = args.length;
    while (i--) {
      if (args[i] != null) break;
    }
  
    return args.slice(0, i + 1).map((arg) => arg || "null");
  }