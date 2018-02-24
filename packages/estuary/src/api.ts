import { IID, IObjectOf } from "@thi.ng/api/api";

export type NodeUpdateHandler = (node: Node, ins: any) => any;

export type HalfEdge = [string, string];
export type Edge = [string, string, string, string];
export type EdgeFn = (a: number[], b: number[]) => any;

export interface Graph {
    nodes: IObjectOf<Node>;
    topology: string[];
}

export interface Node extends IID<string> {
    label: string;
    pos: number[];
    ins: IObjectOf<Port>;
    outs: IObjectOf<Port>;
    edges: IObjectOf<HalfEdge>;
    update: NodeUpdateHandler;
}

export interface NodeConfig extends IID<string> {
    label?: string;
    pos?: number[];
}

export interface Port {
    value: any;
    label?: string;
    order?: number;
    type?: string;
}

export interface NodeOpts {
    ins: PortOpts;
    outs: PortOpts;
    label: LabelOpts;
    width?: number;
    height?: number;
    attribs?: any;
    events?: any;
}

export interface PortOpts {
    pos: number[];
    labelOffset: number[];
    step: number[];
    radius?: number;
    attribs?: any;
    types: IObjectOf<string>;
}

export interface LabelOpts {
    offset: number[];
    attribs?: any;
}
