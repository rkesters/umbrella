import { IID, IObjectOf } from "@thi.ng/api/api";

export type NodeUpdateFn = (node: Node, ins: any) => any;
export type NodeComponentFn = (node: Node, opts: NodeOpts) => any;

export type HalfEdge = [string, string];
export type Edge = [string, string, string, string];
export type EdgeFn = (a: number[], b: number[]) => any;

export type PortSymbolFn = (x: number, y: number) => any;
export type PortComponentFn = (port: Port, id: string, x: number, y: number, lx: number, ly: number, opts: PortOpts) => any;

export interface Graph {
    nodes: IObjectOf<Node>;
    topology: string[];
}

export interface Node extends IID<string> {
    type: string;
    label: string;
    pos: number[];
    ins: IObjectOf<Port>;
    outs: IObjectOf<Port>;
    edges: IObjectOf<HalfEdge>;
    update: NodeUpdateFn;
    body?: NodeComponentFn;
}

export interface NodeConfig extends IID<string> {
    label?: string;
    pos?: number[];
    body?: NodeComponentFn;
}

export interface Port {
    value: any;
    label?: string;
    order?: number;
    type?: string;
    hidden?: boolean;
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
    attribs?: any;
    symbol?: PortComponentFn;
}

export interface LabelOpts {
    offset: number[];
    attribs?: any;
}

export interface GraphOpts {
    nodes: NodeOpts;
    attribs: any;
    edgeAttribs: any;
    edgeFn: EdgeFn;
    defs?: any[];
    pos: number[];
    scale: number;
}
