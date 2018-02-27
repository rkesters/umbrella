import { start } from "@thi.ng/hiccup-dom";
import { defs } from "@thi.ng/hiccup-dom-components/svg";

import { Graph, NodeOpts } from "./api";
import { nodeGraph, defBezierEdgeH, nodeValueLabel, portSymbolArrowIn, portSymbolArrowOut, roundNode, boxNode, nodeLabel } from "./components";
import { setEdges, recompute, updateOutPort } from "./compute";

import { add, mul, madd } from "./nodes/math";
import { LinearPortLayout, RadialPortLayout } from "./port-layout";
import { constant, sink } from "./nodes/terminals";

let click, clickPos, clickID;
let graphClick, graphOffset = [0, 0];
let zoom = 1;

export const labelOpts = {
    offset: [10, 18],
    attribs: {
        fill: "#fff",
        "font-size": "14px",
        "font-weight": 700,
    }
};

export const nodeOpts: NodeOpts = {
    width: 100,
    label: nodeLabel(labelOpts),
    ins: {
        layout: new LinearPortLayout([0, 30], [0, 12]),
        label: {
            offset: [10, 3]
        },
        component: portSymbolArrowIn,
        attribs: {
            "font-size": "10px",
        },
    },
    outs: {
        layout: new LinearPortLayout([100, 30], [0, 12]),
        label: {
            offset: [-10, 3]
        },
        component: portSymbolArrowOut,
        attribs: {
            "font-size": "10px",
            "text-anchor": "end",
        },
    },
    attribs: {
        "font-family": "Arial",
    },
    events: {
        onmousedown: (id) => (e: MouseEvent) => {
            if (!clickID && e.button === 0) {
                clickID = id;
                click = [e.clientX, e.clientY];
                clickPos = graph.nodes[id].ui.pos.slice();
            }
        }
    }
};

const box = boxNode(nodeOpts, 4);
const vbox = boxNode({ ...nodeOpts, label: nodeValueLabel("outs.value.value", labelOpts) }, 4);
const circle = roundNode({
    ...nodeOpts,
    width: 90,
    label: nodeLabel({ ...labelOpts, offset: [0, -14], attribs: { ...labelOpts.attribs, "text-anchor": "middle" } }),
    ins: { ...nodeOpts.ins, layout: new RadialPortLayout(45, 180, -20) },
    outs: { ...nodeOpts.outs, layout: new RadialPortLayout(45, 0, 20) }
});

let graph: Graph = setEdges(
    {
        nodes: {
            a1: add({ id: "a1", ins: { a: 1, b: 2 }, ui: { pos: [-210, -90], component: box } }),
            a2: add({ id: "a2", ins: { a: 1, b: 2 }, ui: { pos: [-210, -25], component: box } }),
            b: mul({ id: "b", ui: { pos: [-40, 20], component: box } }),
            c: madd({ id: "c", ui: { pos: [165, 5], component: circle } }),
            in0: constant({ id: "in0", type: "number", value: 1, ui: { pos: [-365, -110], component: vbox } }),
            in1: constant({ id: "in1", type: "number", value: 2, ui: { pos: [-365, -60], component: vbox } }),
            in2: constant({ id: "in2", type: "number", value: 1, ui: { pos: [-365, 20], component: vbox } }),
            in3: constant({ id: "in3", type: "number", value: 2, ui: { pos: [-365, 70], component: vbox } }),
            in4: constant({ id: "in4", type: "number", value: 1000, ui: { pos: [-40, 85], component: vbox } }),
            out: sink({ id: "out", type: "number", ui: { pos: [275, -25], component: vbox } }),
            out2: sink({ id: "out2", type: "number", ui: { pos: [275, 25], component: vbox } }),
            out3: sink({ id: "out3", type: "number", ui: { pos: [-40, -160], component: vbox } }),
            out4: sink({ id: "out4", type: "number", ui: { pos: [-40, -110], component: vbox } }),
            out5: sink({ id: "out5", type: "number", ui: { pos: [275, 75], component: vbox } }),
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
                    if (!clickID && e.button === 0) {
                        graphClick = [e.clientX, e.clientY];
                        clickPos = graphOffset.slice();
                    }
                },
                onmousemove: (e: MouseEvent) => {
                    if (clickID) {
                        const pos = graph.nodes[clickID].ui.pos;
                        pos[0] = clickPos[0] + (e.clientX - click[0]) / zoom;
                        pos[1] = clickPos[1] + (e.clientY - click[1]) / zoom;
                    } else if (graphClick) {
                        graphOffset[0] = clickPos[0] + (e.clientX - graphClick[0]);
                        graphOffset[1] = clickPos[1] + (e.clientY - graphClick[1]);
                    }
                },
                onmouseup: () => (clickID = click = graphClick = null)
            },
            edgeAttribs: {
                id: "edges",
                "marker-end": "url(#arrow)"
            },
            edgeFn: defBezierEdgeH(10, 0.25),
            defs: docdefs,
            pos: [
                window.innerWidth / 2 + graphOffset[0],
                window.innerHeight / 2 + graphOffset[1]
            ],
            scale: zoom,
        }
    )
);

const inc = (x) => (x + 1) % 10;

let i = 0;
setInterval(
    async () => {
        i++;
        graph = updateOutPort<number>(graph, "in0", "value", inc);
        (i % 4) == 0 && (graph = updateOutPort<number>(graph, "in1", "value", inc));
        (i % 8) == 0 && (graph = updateOutPort<number>(graph, "in2", "value", inc));
        (i % 12) == 0 && (graph = updateOutPort<number>(graph, "in3", "value", inc));
        graph = await recompute(graph);
    }, 250
);

// window["graph"] = graph;
// window["recompute"] = async () => (graph = await recompute(graph));

/*
export * from "./api";
export * from "./components";
export * from "./compute";
export * from "./port-layout";
export * from "./nodes/math";
export * from "./nodes/terminals";
*/