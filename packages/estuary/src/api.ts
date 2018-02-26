import { IID, IObjectOf } from "@thi.ng/api/api";

export type NodeUpdateFn = (node: Node, ins: any) => any;
export type NodeComponentFn = (node: Node, opts: NodeOpts) => any;

export type HalfEdge = [string, string];
export type Edge = [string, string, string, string];
export type EdgeFn = (a: number[], b: number[]) => any;

export type PortSymbolFn = (x: number, y: number) => any;
export type PortComponentFn = (port: Port, id: string, pos: number[], opts: PortOpts) => any;

export interface Graph {
    nodes: IObjectOf<Node>;
    topology: string[];
}

export interface Node extends IID<string> {
    type: string;
    disabled?: boolean;
    ins: IObjectOf<Port>;
    outs: IObjectOf<Port>;
    edges: IObjectOf<HalfEdge>;
    update: NodeUpdateFn;
    ui?: NodeUI;
}

export interface NodeUI {
    pos: number[];
    label: string;
    component: INodeComponent;
    selected?: boolean;
    minimized?: boolean;
}

export interface INodeComponent {
    layoutIn: IPortLayout;
    layoutOut: IPortLayout;
    render(node: Node): any;
}

export interface IPortLayout {
    portPosition(nodePos: number[], ports: IObjectOf<Port>, id: string): number[];
    height(ports: IObjectOf<Port>): number;
}

export interface NodeConfig extends IID<string> {
    ui: Partial<NodeUI>;
}

export interface Port {
    value: any;
    order: number;
    type: string;
    label?: string;
    hidden?: boolean;
}

export interface NodeOpts {
    ins: PortOpts;
    outs: PortOpts;
    label: NodeComponentFn;
    width: number;
    height?: number;
    attribs?: any;
    events?: any;
}

export interface PortOpts {
    layout: IPortLayout;
    label: LabelOpts;
    attribs?: any;
    component?: PortComponentFn;
}

export interface LabelOpts {
    offset: number[];
    attribs?: any;
}

export interface GraphOpts {
    attribs: any;
    edgeAttribs: any;
    edgeFn: EdgeFn;
    defs?: any[];
    pos: number[];
    scale: number;
}
