import { IObjectOf } from "@thi.ng/api/api";
import { Node, NodeConfig, NodeUpdateFn, Port } from "../api";

export function defNode(opts: NodeConfig, type: string, ins: IObjectOf<Port>, outs: IObjectOf<Port>, update: NodeUpdateFn): Node {
    return {
        id: opts.id,
        type,
        ins,
        outs,
        edges: {},
        update,
        ui: <any>{ pos: [0, 0], label: type, ...opts.ui },
    };
}
