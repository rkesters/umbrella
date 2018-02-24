import { Port } from "../api";

export function defPort(id: string, ins: any, type: string, order: number, defVal: any): Port {
    return {
        type,
        order,
        value: ins[id] !== undefined ? ins[id] : defVal,
    };
}

export function numericPort(id: string, ins: any, order: number) {
    return defPort(id, ins, "number", order, 0);
}
