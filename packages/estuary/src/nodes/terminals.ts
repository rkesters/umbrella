import { Node, NodeConfig, NodeUpdateHandler } from "../api";

import { defPort } from "./ports";

export interface ConstOpts extends NodeConfig {
    value: any;
    type: string;
}

export interface SinkOpts extends NodeConfig {
    fn: NodeUpdateHandler;
    type: string;
}

export function constant(opts: ConstOpts): Node {
    return {
        id: opts.id,
        label: opts.label || "const",
        pos: opts.pos || [0, 0],
        ins: {},
        update: () => { },
        outs: {
            value: defPort("value", {}, opts.type, 0, opts.value)
        },
        edges: {}
    }
}

export function sink(opts: SinkOpts): Node {
    return {
        id: opts.id,
        label: opts.label || "sink",
        pos: opts.pos || [0, 0],
        update: opts.fn,
        ins: {
            value: defPort("value", {}, opts.type, 0, null)
        },
        outs: {},
        edges: {}
    };
}
