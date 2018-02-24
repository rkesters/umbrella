import { start } from "@thi.ng/hiccup-dom";
import { svgdoc, group, defs, linearGradient } from "@thi.ng/hiccup-dom-components/svg";
import { iterator } from "@thi.ng/transducers/iterator";
import { pairs } from "@thi.ng/transducers/iter/pairs";
import { map } from "@thi.ng/transducers/xform/map";

import { Graph, NodeOpts } from "./api";
import { node, edges, bezierEdgeH } from "./components";
import { setEdges, recompute } from "./compute";

import { add, mul, madd } from "./nodes/math";
import { constant, sink } from "./nodes/terminals";

let click, clickPos;
let globalClick, globalOffset = [0, 0];
let zoom = 1;

export const types = {
    "number": "#9ff",
    "string": "#cf9",
};

export const nodeStyle: NodeOpts = {
    width: 100,
    label: {
        offset: [10, 18],
        attribs: {
            fill: "#fff",
            "font-size": "14px",
            "font-weight": 700,
        }
    },
    ins: {
        pos: [0, 30],
        step: [0, 12],
        labelOffset: [10, 3],
        types,
        attribs: {
            "font-size": "10px",
        },
    },
    outs: {
        pos: [100, 30],
        step: [0, 12],
        labelOffset: [-10, 3],
        types,
        attribs: {
            "font-size": "10px",
            "text-anchor": "end",
        },
    },
    attribs: {
        "fill": "url(#bg)",
        "font-family": "Arial",
    },
    events: {
        onmousedown: (id) => (e: MouseEvent) => {
            if (!click && !globalClick) {
                e.stopImmediatePropagation();
                click = [e.clientX, e.clientY];
                clickPos = graph.nodes[id].pos.slice();
            }
        },
        onmousemove: (id) => (e: MouseEvent) => {
            if (click) {
                e.stopImmediatePropagation();
                graph.nodes[id].pos[0] = clickPos[0] + (e.clientX - click[0]) / zoom;
                graph.nodes[id].pos[1] = clickPos[1] + (e.clientY - click[1]) / zoom;
            }
        }
    }
};

const graph: Graph = setEdges(
    {
        nodes: {
            a1: add({ id: "a1", pos: [-210, -90], ins: { a: 1, b: 2 } }),
            a2: add({ id: "a2", pos: [-210, -25], ins: { a: 1, b: 2 } }),
            b: mul({ id: "b", pos: [-40, 40] }),
            c: madd({ id: "c", pos: [125, 0] }),
            in0: constant({ id: "in0", pos: [-365, -110], type: "number", value: 1 }),
            in1: constant({ id: "in1", pos: [-365, -60], type: "number", value: 2 }),
            in2: constant({ id: "in2", pos: [-365, 20], type: "number", value: 10 }),
            in3: constant({ id: "in3", pos: [-365, 70], type: "number", value: 20 }),
            in4: constant({ id: "in4", pos: [-40, 105], type: "number", value: 100 }),
            out: sink({ id: "out", pos: [275, 0], type: "number", fn: (_, ins) => console.log(ins.value) }),
        },
        topology: ["in0", "in1", "in2", "in3", "in4", "a1", "a2", "b", "c", "out"],
    },
    [
        ["b", "a", "a1", "res"],
        ["b", "b", "a2", "res"],
        ["c", "a", "a1", "res"],
        ["c", "b", "b", "res"],
        ["c", "c", "in4", "value"],
        ["a1", "a", "in0", "value"],
        ["a1", "b", "in1", "value"],
        ["a2", "a", "in2", "value"],
        ["a2", "b", "in3", "value"],
        ["out", "value", "c", "res"],
    ]
);

const docdefs = defs(
    linearGradient("bg", 0, 0, 0, 1, [[0, "rgba(0,0,0,0.85)"], [0.5, "rgba(51,51,51,0.85)"]]),
    ["filter#blur", ["feGaussianBlur", { in: "SourceGraphic", stdDeviation: 3 }]],
    ["marker#arrow",
        { viewBox: "0 0 10 10", refX: 14, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto" },
        ["path", { d: "M0,0L10,5,0,10z", fill: "#999" }]]
);

start("app", () =>
    svgdoc(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            onwheel: (e) => {
                e.preventDefault();
                zoom = Math.max(Math.min(zoom + e.deltaY * 0.01, 2), 0.25);
            },
            onmousedown: (e: MouseEvent) => {
                globalClick = [e.clientX, e.clientY];
                clickPos = globalOffset.slice();
            },
            onmousemove: (e: MouseEvent) => {
                if (globalClick) {
                    globalOffset[0] = clickPos[0] + (e.clientX - globalClick[0]);
                    globalOffset[1] = clickPos[1] + (e.clientY - globalClick[1]);
                }
            },
            onmouseup: () => (click = globalClick = null)
        },
        docdefs,
        group(
            { transform: `translate(${window.innerWidth / 2 + globalOffset[0]}, ${window.innerHeight / 2 + globalOffset[1]}) scale(${zoom})` },
            group(
                { stroke: "#999", fill: "none", "marker-end": "url(#arrow)" },
                ...edges(graph.nodes, nodeStyle, bezierEdgeH(10, 0.25))
            ),
            ...iterator(map((n) => node(n[1], nodeStyle)), pairs(graph.nodes)),
        )
    )
);

window["graph"] = graph;
window["recompute"] = recompute;