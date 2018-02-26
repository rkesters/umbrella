import { IObjectOf } from "@thi.ng/api/api";
import { getter } from "@thi.ng/atom/path";
import * as svg from "@thi.ng/hiccup-dom-components/svg";

import { EdgeFn, Node, NodeOpts, Port, PortOpts, PortSymbolFn, Graph, GraphOpts, IPortLayout, LabelOpts } from "./api";

export function defBezierEdgeH(offset = 0, curvature = 0.5) {
    return ([ax, ay], [bx, by]) => {
        const dx = bx - ax;
        const dy = by - ay;
        const dxo = dx - 2 * offset;
        return ["path",
            {
                d: offset > 0 ?
                    `M${ax},${ay}l${offset},0c${dxo * curvature},0,${dxo * (1 - curvature)},${dy},${dxo},${dy}l${offset},0` :
                    `M${ax},${ay}c${dx * curvature},0,${dx * (1 - curvature)},${dy},${dx},${dy}`,
            }
        ];
    };
}

export function defLinearEdgeH(offset = 0) {
    return offset > 0 ?
        ([ax, ay], [bx, by]) => svg.polyline([[ax, ay], [ax + offset, ay], [bx - offset, by], [bx, by]]) :
        (a, b) => svg.polyline([a, b]);
}

export function* edges(nodes: IObjectOf<Node>, edgeFn: EdgeFn) {
    for (let id in nodes) {
        const srcNode = nodes[id];
        const nedges = srcNode.edges;
        for (let pid in nedges) {
            const e = nedges[pid];
            if (e) {
                const destNode = nodes[e[0]];
                const l1 = srcNode.ui.component.layoutIn;
                const l2 = destNode.ui.component.layoutOut;
                yield edgeFn(
                    l2.portPosition(destNode.ui.pos, destNode.outs, e[1]),
                    l1.portPosition(srcNode.ui.pos, srcNode.ins, pid)
                );
            }
        }
    }
}

export function defPortSymbol(sym: PortSymbolFn) {
    return (p: Port, id: string, [x, y]: number[], opts: PortOpts) =>
        ["g", { class: `port port-${p.type}` },
            sym(x, y),
            svg.text(p.label || id, [x + opts.label.offset[0], y + opts.label.offset[1]])
        ];
}

export const portSymbolDot = defPortSymbol((x, y) => svg.circle([x, y], 3));
export const portSymbolArrowIn = defPortSymbol((x, y) => ["path", { d: `M${x - 3},${y}l3,-3,3,0,0,6,-3,0z` }]);
export const portSymbolArrowOut = defPortSymbol((x, y) => ["path", { d: `M${x + 3},${y}l-3,-3,-3,0,0,6,3,0z` }]);

export function portGroup(layout: IPortLayout, ports: IObjectOf<Port>, opts: PortOpts) {
    const group = ["g", opts.attribs || {}];
    for (let id in ports) {
        const port = ports[id];
        if (!port.hidden) {
            group.push((opts.component || portSymbolDot)(port, id, layout.portPosition([0, 0], ports, id), opts));
        }
    }
    return group;
}

export function nodeLabel(opts: LabelOpts) {
    return (node: Node) => svg.text(node.ui.label, opts.offset, opts.attribs);
}

export function nodeValueLabel(path: string | string[], opts: LabelOpts, missing = "n/a") {
    const get = getter(path);
    return (node: Node) => {
        const val = get(node);
        return svg.text(
            (val != null ? val : missing).toString(),
            opts.offset,
            opts.attribs
        );
    };
}

export function nodeEvents(id: string, events: any) {
    const acc = {};
    for (let e in events) {
        acc[e] = events[e](id);
    }
    return acc;
}

export function node(opts: NodeOpts, shapeFn: (node: Node, opts: NodeOpts) => any) {
    return {
        layoutIn: opts.ins.layout,
        layoutOut: opts.outs.layout,
        render: (node: Node) =>
            ["g",
                {
                    id: node.id,
                    class: `node node-${node.type}`,
                    transform: `translate(${node.ui.pos[0]} ${node.ui.pos[1]})`,
                    ...nodeEvents(node.id, opts.events),
                    ...opts.attribs,
                },
                shapeFn(node, opts),
                portGroup(opts.ins.layout, node.ins, opts.ins),
                portGroup(opts.outs.layout, node.outs, opts.outs),
                opts.label(node, opts),
            ]
    };
}

export function boxNode(opts: NodeOpts, rx = 0) {
    return node(
        opts,
        (node, opts) =>
            ["rect",
                {
                    width: opts.width,
                    height: Math.max(opts.ins.layout.height(node.ins), opts.outs.layout.height(node.outs)),
                    rx
                }
            ]
    );
}

export function roundNode(opts: NodeOpts) {
    return node(opts, (node, opts) => ["circle", { r: opts.width / 2 }]);
}

export function nodeGraph(graph: Graph, opts: GraphOpts) {
    const body = ["g", { transform: `translate(${opts.pos[0]}, ${opts.pos[1]}) scale(${opts.scale})` },
        ["g", opts.edgeAttribs, ...edges(graph.nodes, opts.edgeFn)],
    ];
    for (let id in graph.nodes) {
        const n = graph.nodes[id];
        body.push(n.ui.component.render(n));
    }
    return svg.svgdoc(opts.attribs, opts.defs, body);
}
