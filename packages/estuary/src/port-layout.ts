import { IObjectOf } from "@thi.ng/api/api";
import { Port, IPortLayout } from "./api";

const DEG2RAD = Math.PI / 180;

export class LinearPortLayout implements
    IPortLayout {

    pos: number[];
    delta: number[];

    /**
     * @param pos relative offset to node pos
     * @param delta separation vector between ports
     */
    constructor(pos: number[], delta: number[]) {
        this.pos = pos;
        this.delta = delta;
    }

    portPosition(npos: number[], ports: IObjectOf<Port>, id: string) {
        const idx = ports[id].order;
        return [
            npos[0] + this.pos[0] + idx * this.delta[0],
            npos[1] + this.pos[1] + idx * this.delta[1]
        ];
    }

    height(ports: IObjectOf<Port>) {
        return this.pos[1] + Object.keys(ports).length * this.delta[1];
    }
}

export class RadialPortLayout implements
    IPortLayout {

    r: number;
    theta: number;
    delta: number;

    /**
     * @param radius layout radius
     * @param theta start angle (degrees)
     * @param delta angle separation between ports
     */
    constructor(radius: number, theta: number, delta: number) {
        this.r = radius;
        this.theta = theta * DEG2RAD;
        this.delta = delta * DEG2RAD;
    }

    portPosition(npos: number[], ports: IObjectOf<Port>, id: string) {
        const theta = this.theta + ports[id].order * this.delta;
        return [
            npos[0] + this.r * Math.cos(theta),
            npos[1] + this.r * Math.sin(theta)
        ];
    }

    height() {
        return this.r;
    }
}
