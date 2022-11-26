export function emit(instance, event, ...args) {
    const { props } = instance;

    // TPP 先具体再抽象
    const camelize = (str: string) => {
        return str.replace(/-(\w)/g, (_, c: string) => {
            return c ? c.toUpperCase() : '';
        })
    }

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const handlerKey = (str: string) => {
        return str ? "on" + capitalize(str) : "";
    }

    const handler = props[handlerKey(camelize(event))];

    handler && handler(...args);
}