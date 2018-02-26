import { IObjectOf } from "@thi.ng/api/api";
import { getter } from "@thi.ng/atom/path";
import * as svg from "@thi.ng/hiccup-dom-components/svg";
import { iterator } from "@thi.ng/transducers/iterator";
import { keys } from "@thi.ng/transducers/iter/keys";
import { vals } from "@thi.ng/transducers/iter/vals";
import { map } from "@thi.ng/transducers/xform/map";
import { mapIndexed } from "@thi.ng/transducers/xform/map-indexed";

import { EdgeFn, Node, NodeOpts, Port, PortOpts, PortSymbolFn, Graph, GraphOpts, IPortLayout, LabelOpts } from "./api";

export function defBezierEdgeH(offset = 0, curvature = 0.5) {
    return ([ax, ay], [bx, by]) => {
        const dx = bx - ax;
        const dy = by - ay;
        const dxo = dx - 2 * offset;
        return [
            "path",
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
        svg.group(
            { class: `port port-${p.type}` },
            sym(x, y),
            svg.text(p.label || id, [x + opts.label.offset[0], y + opts.label.offset[1]])
        );
}

export const portSymbolDot = defPortSymbol((x, y) => svg.circle([x, y], 3));
export const portSymbolArrowIn = defPortSymbol((x, y) => ["path", { d: `M${x - 3},${y}l3,-3,3,0,0,6,-3,0z` }]);
export const portSymbolArrowOut = defPortSymbol((x, y) => ["path", { d: `M${x + 3},${y}l-3,-3,-3,0,0,6,3,0z` }]);

export function portGroup(layout: IPortLayout, ports: IObjectOf<Port>, opts: PortOpts) {
    return svg.group(
        opts.attribs || {},
        ...iterator(
            mapIndexed<string, any>(
                (i, id) => {
                    const port = ports[id];
                    if (!port.hidden) {
                        return (opts.component || portSymbolDot)(port, id, layout.portPosition([0, 0], ports, id), opts);
                    }
                }
            ),
            keys(ports)
        )
    );
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
    return Object.keys(events).reduce((acc, e) => (acc[e] = events[e](id), acc), {});
}

export function node(opts: NodeOpts, shapeFn: (node: Node, opts: NodeOpts) => any) {
    return {
        layoutIn: opts.ins.layout,
        layoutOut: opts.outs.layout,
        render: (node: Node) =>
            svg.group(
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
            )
    };
}

export function boxNode(opts: NodeOpts, rx = 0) {
    return node(
        opts,
        (node, opts) =>
            svg.rect(
                [0, 0],
                opts.width,
                Math.max(opts.ins.layout.height(node.ins), opts.outs.layout.height(node.outs)),
                { rx }
            )
    );
}

export function roundNode(opts: NodeOpts) {
    return node(opts, (node, opts) => svg.circle([0, 0], opts.width / 2));
}

export function nodeGraph(graph: Graph, opts: GraphOpts) {
    return svg.svgdoc(
        opts.attribs,
        opts.defs,
        svg.group(
            { transform: `translate(${opts.pos[0]}, ${opts.pos[1]}) scale(${opts.scale})` },
            svg.group(opts.edgeAttribs, ...edges(graph.nodes, opts.edgeFn)),
            ...iterator(map((n: Node) => n.ui.component.render(n)), vals(graph.nodes)),
        )
    );
}
