import { Node, NodeConfig, NodeUpdateFn } from "../api";

import { defPort } from "./ports";

export interface ConstOpts extends NodeConfig {
    value: any;
    type: string;
}

export interface SinkOpts extends NodeConfig {
    update?: NodeUpdateFn;
    type: string;
}

export function constant(opts: ConstOpts): Node {
    return {
        type: "const",
        id: opts.id,
        label: opts.label || "const",
        pos: opts.pos || [0, 0],
        ins: {},
        outs: {
            value: defPort("value", {}, opts.type, 0, opts.value)
        },
        edges: {},
        update: () => { },
        component: opts.component,
    }
}

export function sink(opts: SinkOpts): Node {
    const update = opts.update || (() => { });
    const node = {
        type: "sink",
        id: opts.id,
        label: opts.label || "sink",
        pos: opts.pos || [0, 0],
        ins: {
            value: defPort("value", {}, opts.type, 0, null)
        },
        outs: {
            value: defPort("value", {}, opts.type, 0, null)
        },
        edges: {},
        update: (n, ins) => ({ value: ins.value.value, ...update(n, ins) }),
        component: opts.component,
    };
    node.outs.value.hidden = true;
    return node;
}
