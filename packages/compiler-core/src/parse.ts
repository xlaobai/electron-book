import { NodeTypes, ElementTypes } from "./ast";

const enum TagType {
    Start,
    End
}

export function baseParse(content: string) {
    const context = createParserContext(content);

    return createRoot(parseChildren(context, []));
}

function createParserContext(content: string) {
    return {
        source: content
    }
}

function createRoot(children: any) {
    return {
        children,
        type: NodeTypes.ROOT
    };
}

function parseChildren(context: any, ancestors: any) {
    let nodes:any = [];

    // TODO::有限状态机 - 判断类型, 正则等
    while(!isEnd(context, ancestors)) {
        let node;
        const s = context.source;
        if(s.startsWith("{{")) {
            node = parseInterpolation(context);
        } else if(s[0] === "<") {
            if (s[1] === "/") {
                // 这里属于 edge case 可以不用关心
                // 处理结束标签
                if (/[a-z]/i.test(s[2])) {
                  // 匹配 </div>
                  // 需要改变 context.source 的值 -> 也就是需要移动光标
                  parseTag(context, TagType.End);
                  // 结束标签就以为这都已经处理完了，所以就可以跳出本次循环了
                  continue;
                }
              } else if(/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors);
            }
        }
    
        if(!node) {
            node = parseText(context);
        }
    
        nodes.push(node);
    }

    return nodes;
}

function isEnd(context: any, ancestors: any) {
    const s = context.source;

    // 遇到结束标签时
    if(s.startsWith(`</`)) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
            const element = ancestors[i];
            if(startsWithEndTagOpen(s, element.tag)) {
                return true;
            }
        }
    }

    // source没有值时
    return !s
}

function startsWithEndTagOpen(source: string, tag: string) {
    // 1. 头部 是不是以  </ 开头的
    // 2. 看看是不是和 tag 一样
    return (
      source.startsWith("</") &&
      source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
    );
  }

function parseInterpolation(context: any) {

    // {{message}}
    // 设置标志符
    const openDelimiter = "{{";
    const closeDelimiter = "}}";

    // 获取关闭标志符的位置
    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);

    // 先删除开始标识
    advanceBy(context, openDelimiter.length);

    // 获取标志符中间内容长度
    const rawContentLength = closeIndex - openDelimiter.length;
    const rawContent = context.source.slice(0, rawContentLength);
    const preTrimContent = parseTextData(context, rawContent.length);

    // 去除文本前后空格
    const content = preTrimContent.trim();

    // 最后在让代码前进2个长度，删除结束标识
    advanceBy(context, closeDelimiter.length);
    // console.log("parseInterpolation-source", context.source);

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content,
        },
    };
}

function parseElement(context: any, ancestors: any) {

    // 解析tag
    const element: any = parseTag(context, TagType.Start);
    
    ancestors.push(element);
    element.children = parseChildren(context, ancestors);
    ancestors.pop();

    if(startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagType.End);
    } else {
        throw new Error(`缺失结束标签：${element.tag}`);
    }

    // console.log("parseElement-source", context.source);

    return element;
}

function parseText(context: any) {

    let endIndex = context.source.length;
    const endTokens = ["<", "{{"];

    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i]);
        // endIndex > index 是需要要 endIndex 尽可能的小
        // 比如说：
        // hi, {{123}} <div></div>
        // 那么这里就应该停到 {{ 这里，而不是停到 <div 这里
        if (index !== -1 && endIndex > index) {
          endIndex = index;
        }
    }

    const content = parseTextData(context, endIndex);
    // console.log("parseText-source", context.source);

    return {
        type: NodeTypes.TEXT,
        content
    };
}

function parseTextData(context: any, length: number) {
    // 1. 获取文本内容
    const content = context.source.slice(0, length);

    // 删除文本
    advanceBy(context, length)

    return content;
}

function parseTag(context: any, type: TagType) {
    // 1. 解析tag
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    // console.log(match);
    const tag = match[1];
    // 2. 删除处理完成代码
    advanceBy(context, match[0].length);
    advanceBy(context, 1);

    if(type === TagType.End) return;

    return {
        type: NodeTypes.ELEMENT,
        tag,
        tagType: ElementTypes.ELEMENT,
        children: [],
    }
}

function advanceBy(context, numberOfCharacters) {
    // console.log("推进代码", context, numberOfCharacters);
    context.source = context.source.slice(numberOfCharacters);
}