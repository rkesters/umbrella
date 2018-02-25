import { start } from "@thi.ng/hiccup-dom";
import { defs } from "@thi.ng/hiccup-dom-components/svg";

import { Graph, NodeOpts } from "./api";
import { nodeGraph, bezierEdgeH, nodeValueLabel, portSymbolArrowIn, portSymbolArrowOut } from "./components";
import { setEdges, recompute } from "./compute";

import { add, mul, madd } from "./nodes/math";
import { constant, sink } from "./nodes/terminals";
import { updateIn } from "@thi.ng/atom/path";

let click, clickPos;
let graphClick, graphOffset = [0, 0];
let zoom = 1;

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
        symbol: portSymbolArrowIn,
        attribs: {
            "font-size": "10px",
        },
    },
    outs: {
        pos: [100, 30],
        step: [0, 12],
        labelOffset: [-10, 3],
        symbol: portSymbolArrowOut,
        attribs: {
            "font-size": "10px",
            "text-anchor": "end",
        },
    },
    attribs: {
        // "fill": "url(#bg)",
        "font-family": "Arial",
    },
    events: {
        onmousedown: (id) => (e: MouseEvent) => {
            if (!click && !graphClick) {
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

const valueLabel = nodeValueLabel("outs.value.value");

let graph: Graph = setEdges(
    {
        nodes: {
            a1: add({ id: "a1", pos: [-210, -90], ins: { a: 1, b: 2 } }),
            a2: add({ id: "a2", pos: [-210, -25], ins: { a: 1, b: 2 } }),
            b: mul({ id: "b", pos: [-40, 20] }),
            c: madd({ id: "c", pos: [120, -25] }),
            in0: constant({ id: "in0", pos: [-365, -110], type: "number", value: 1, body: valueLabel }),
            in1: constant({ id: "in1", pos: [-365, -60], type: "number", value: 2, body: valueLabel }),
            in2: constant({ id: "in2", pos: [-365, 20], type: "number", value: 1, body: valueLabel }),
            in3: constant({ id: "in3", pos: [-365, 70], type: "number", value: 2, body: valueLabel }),
            in4: constant({ id: "in4", pos: [-40, 85], type: "number", value: 10, body: valueLabel }),
            out: sink({ id: "out", pos: [275, -25], type: "number", body: valueLabel }),
            out2: sink({ id: "out2", pos: [275, 25], type: "number", body: valueLabel }),
            out3: sink({ id: "out3", pos: [275, -160], type: "number", body: valueLabel }),
            out4: sink({ id: "out4", pos: [275, -110], type: "number", body: valueLabel }),
            out5: sink({ id: "out5", pos: [275, 75], type: "number", body: valueLabel }),
        },
        topology: ["in0", "in1", "in2", "in3", "in4", "a1", "out3", "a2", "out4", "b", "c", "out", "out2", "out5"],
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
        ["out2", "value", "c", "product"],
        ["out3", "value", "a1", "res"],
        ["out4", "value", "a2", "res"],
        ["out5", "value", "b", "res"],
    ]
);

const docdefs = defs(
    ["marker#arrow",
        { viewBox: "0 0 10 10", refX: 14, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto" },
        ["path", { d: "M0,0L10,5,0,10z", fill: "#999" }]]
);

start("app", () =>
    nodeGraph(
        graph,
        {
            attribs: {
                width: window.innerWidth,
                height: window.innerHeight,
                onwheel: (e) => {
                    e.preventDefault();
                    zoom = Math.max(Math.min(zoom + e.deltaY * 0.01, 2), 0.25);
                },
                onmousedown: (e: MouseEvent) => {
                    graphClick = [e.clientX, e.clientY];
                    clickPos = graphOffset.slice();
                },
                onmousemove: (e: MouseEvent) => {
                    if (graphClick) {
                        graphOffset[0] = clickPos[0] + (e.clientX - graphClick[0]);
                        graphOffset[1] = clickPos[1] + (e.clientY - graphClick[1]);
                    }
                },
                onmouseup: () => (click = graphClick = null)
            },
            edgeAttribs: {
                id: "edges",
                "marker-end": "url(#arrow)"
            },
            edgeFn: bezierEdgeH(10, 0.25),
            defs: docdefs,
            nodes: nodeStyle,
            pos: [
                window.innerWidth / 2 + graphOffset[0],
                window.innerHeight / 2 + graphOffset[1]
            ],
            scale: zoom,
        }
    )
);

let i = 0;
setInterval(
    async () => {
        i++;
        graph = updateIn(graph, "nodes.in0.outs.value.value", (x) => (x + 1) % 10);
        (i % 4) == 0 && (graph = updateIn(graph, "nodes.in1.outs.value.value", (x) => (x + 1) % 10));
        (i % 8) == 0 && (graph = updateIn(graph, "nodes.in2.outs.value.value", (x) => (x + 1) % 10));
        (i % 12) == 0 && (graph = updateIn(graph, "nodes.in3.outs.value.value", (x) => (x + 1) % 10));
        graph = await recompute(graph);
    }, 250
);

// window["graph"] = graph;
window["recompute"] = async () => (graph = await recompute(graph));