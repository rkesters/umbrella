import { IObjectOf } from "@thi.ng/api/api";
import { deleteIn, getIn, setIn } from "@thi.ng/atom/path";
import { Graph, Node, Edge } from "./api";

export function setEdge(graph: Graph, inID: string, inPort: string, outID: string, outPort: string) {
    return setIn(graph, ["nodes", inID, "edges", inPort], [outID, outPort]);
}

export function removeEdge(graph: Graph, inID: string, inPort: string) {
    return deleteIn(graph, ["nodes", inID, "edges", inPort]);
}

export function setEdges(graph: Graph, edges: Edge[]) {
    for (let e of edges) {
        graph = setEdge.apply(null, [graph, ...e]);
    }
    return graph;
}

export function removeInputEdges(graph: Graph, edges: [string, string][]) {
    for (let e of edges) {
        graph = removeEdge.apply(null, [graph, ...e]);
    }
    return graph;
}

function resolveInputs(nodes: IObjectOf<Node>, node: Node) {
    const res = { ...node.ins };
    for (let id in node.edges) {
        const [nid, oid] = node.edges[id];
        res[id] = getIn(nodes, [nid, "outs", oid]);
    }
    return res;
}

export async function recompute(graph: Graph) {
    let nodes = { ...graph.nodes };
    for (let id of graph.topology) {
        const node = nodes[id];
        const ins = resolveInputs(nodes, node);
        const outs = await node.update(node, ins);
        if (outs) {
            for (let oid in outs) {
                nodes = setIn(nodes, [id, "outs", oid, "value"], outs[oid]);
            }
        }
    }
    return { ...graph, nodes };
}
