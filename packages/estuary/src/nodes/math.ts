import { Node, NodeConfig, NodeUpdateHandler } from "../api";

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

export function mathOp(opts: MathOp2Opts, impl: NodeUpdateHandler): Node {
    opts.ins = opts.ins || {};
    return {
        id: opts.id,
        label: opts.label,
        pos: opts.pos || [0, 0],
        update: impl,
        ins: {
            a: numericPort("a", opts.ins, 0),
            b: numericPort("b", opts.ins, 1),
        },
        outs: {
            res: numericPort("res", {}, 0)
        },
        edges: {}
    };
}

export function add(opts: MathOp2Opts) {
    return mathOp(
        { ...opts, label: opts.label || "add" },
        (_, ins) => ({ res: ins.a.value + ins.b.value })
    );
}

export function sub(opts: MathOp2Opts) {
    return mathOp(
        { ...opts, label: opts.label || "sub" },
        (_, ins) => ({ res: ins.a.value - ins.b.value })
    );
}

export function mul(opts: MathOp2Opts) {
    return mathOp(
        { ...opts, label: opts.label || "mul" },
        (_, ins) => ({ res: ins.a.value * ins.b.value })
    );
}

export function div(opts: MathOp2Opts) {
    return mathOp(
        { ...opts, label: opts.label || "div" },
        (_, ins) => ({ res: ins.a.value / ins.b.value })
    );
}

export function madd(opts: MathOp3Opts) {
    const node = mathOp(
        { ...opts, label: opts.label || "madd" },
        (_, ins) => {
            let product = ins.a.value * ins.b.value;
            return { product, res: product + ins.c.value };
        }
    );
    node.ins.c = numericPort("c", opts.ins || {}, 2);
    node.outs.product = numericPort("product", {}, 1);
    return node;
}
