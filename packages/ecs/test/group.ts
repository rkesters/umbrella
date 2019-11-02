import { equiv } from "@thi.ng/equiv";
import * as assert from "assert";
import { ECS, Group } from "../src";

const collect = (g: Group<any, any>) => {
    let res: any[] = [];
    g.forEach((x) => res.push(x));
    return res;
};

describe("component", () => {
    let ecs: ECS<any>;

    beforeEach(() => (ecs = new ECS(16)));

    it("group", () => {
        const a = ecs.defComponent({ id: "a", default: () => "a" });
        const b = ecs.defComponent({ id: "b", type: 7, size: 2 });
        const g = ecs.defGroup([a, b]);
        ecs.defEntity(["a", "b"]);
        ecs.defEntity({ a: "aa", b: [1, 2] });
        ecs.defEntity({ a: "aaa", b: [3, 4] });
        assert.ok(g.has(0));
        assert.ok(g.has(1));
        assert.ok(g.has(2));
        assert.ok(!g.has(3));
        assert.deepEqual([...ecs.componentsForID(2)], [a, b]);
        assert.deepEqual([...ecs.groupsForID(2)], [g]);
        assert.ok(
            equiv(collect(g), [
                { a: "a", b: [0, 0], id: 0 },
                { a: "aa", b: [1, 2], id: 1 },
                { a: "aaa", b: [3, 4], id: 2 }
            ])
        );

        a.delete(0);
        assert.ok(
            equiv(collect(g), [
                { a: "aa", b: [1, 2], id: 1 },
                { a: "aaa", b: [3, 4], id: 2 }
            ])
        );
        a.delete(2);
        assert.ok(equiv(collect(g), [{ a: "aa", b: [1, 2], id: 1 }]));
        a.set(1, "hi");
        assert.ok(equiv(collect(g), [{ a: "hi", b: [1, 2], id: 1 }]));
    });
});
