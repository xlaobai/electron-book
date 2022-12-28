export * from "../src/shapeFlags";
export * from "../src/toDisplayString";

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const isString = (val) => typeof val === "string";

const camelizeRE = /-(\w)/g;
/**
 * @private
 * 把烤肉串命名方式转换成驼峰命名方式
 */
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));
};

export const extend = Object.assign;

// 必须是 on+一个大写字母的格式开头
export const isOn = (key) => /^on[A-Z]/.test(key);

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}

export function hasOwn(val, key) {
  return Object.prototype.hasOwnProperty.call(val, key);
}

/**
 * @private
 * 首字母大写
 */
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @private
 * 添加 on 前缀，并且首字母大写
 */
export const toHandlerKey = (str: string) =>
  str ? `on${capitalize(str)}` : ``;

// 用来匹配 kebab-case 的情况
// 比如 onTest-event 可以匹配到 T
// 然后取到 T 在前面加一个 - 就可以
// \BT 就可以匹配到 T 前面是字母的位置
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
export const hyphenate = (str: string) =>
  str.replace(hyphenateRE, "-$1").toLowerCase();

/**
 * 判断当前对象是否有某个属性
 * @param target 对象
 * @param k 属性
 * @returns 
 */
export const hasQwnProperty = (target: object, k: string) => {
  return Object.prototype.hasOwnProperty.call(target, k)
}

/**
 * 格式化emit的事件名
 * @param name 
 * @returns 
 */
export const formatEmitName = (name: string) => {
  return name ? `on${capitalize(name)}` : "";
}

/**
 * 是否是事件名（规范：onEventName）
 * @param name 名称
 * @returns 如果满足规范，则返回转换成小写的事件名，如果不满足，则直接返回空
 */
export const isEventName = (name: string) => {
  const isOn = /^on[A-Z]/.test(name);
  return isOn ? name.slice(2).toLowerCase() : ''
}


