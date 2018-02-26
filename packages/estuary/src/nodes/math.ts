import { Node, NodeConfig, NodeUpdateFn } from "../api";
import { defNode } from "./node";
import { numericPort } from "./ports";

export interface MathOp2Opts extends NodeConfig {
    ins?: {
        a?: number;
        b?: number;
    }
}

export interface MathOp3Opts extends NodeConfig {
    ins?: {
        a?: number;
        b?: number;
        c?: number;
    }
}

export function mathOp(opts: MathOp2Opts, type: string, impl: NodeUpdateFn): Node {
    opts.ins = opts.ins || {};
    return defNode(
        opts,
        type,
        {
            a: numericPort("a", opts.ins, 0),
            b: numericPort("b", opts.ins, 1),
        },
        {
            res: numericPort("res", {}, 0)
        },
        impl
    );
}

export function add(opts: MathOp2Opts) {
    return mathOp(
        opts, "add",
        (_, ins) => ({ res: ins.a.value + ins.b.value })
    );
}

export function sub(opts: MathOp2Opts) {
    return mathOp(
        opts, "sub",
        (_, ins) => ({ res: ins.a.value - ins.b.value })
    );
}

export function mul(opts: MathOp2Opts) {
    return mathOp(
        opts, "mul",
        (_, ins) => ({ res: ins.a.value * ins.b.value })
    );
}

export function div(opts: MathOp2Opts) {
    return mathOp(
        opts, "div",
        (_, ins) => ({ res: ins.a.value / ins.b.value })
    );
}

export function madd(opts: MathOp3Opts) {
    const node = mathOp(
        opts, "madd",
        (_, ins) => {
            let product = ins.a.value * ins.b.value;
            return { product, res: product + ins.c.value };
        }
    );
    node.ins.c = numericPort("c", opts.ins || {}, 2);
    node.outs.product = numericPort("product", {}, 1);
    return node;
}
