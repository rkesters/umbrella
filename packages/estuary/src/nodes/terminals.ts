import { Node, NodeConfig, NodeUpdateFn } from "../api";
import { defNode } from "./node";
import { defPort } from "./ports";

export interface ConstOpts extends NodeConfig {
    value: any;
    type: string;
}

export interface SinkOpts extends NodeConfig {
    update?: NodeUpdateFn;
    type: string;
}

const NOP = () => { };

export function constant(opts: ConstOpts): Node {
    return defNode(
        opts,
        "const",
        {},
        { value: defPort("value", {}, opts.type, 0, opts.value) },
        NOP
    );
}

export function sink(opts: SinkOpts): Node {
    const update = opts.update || NOP;
    const node = defNode(
        opts,
        "sink",
        { value: defPort("value", {}, opts.type, 0, null) },
        { value: defPort("value", {}, opts.type, 0, null) },
        (n, ins) => ({ value: ins.value.value, ...update(n, ins) }),
    );
    node.outs.value.hidden = true;
    return node;
}
