import {
    $x,
    $y,
    $z,
    defn,
    FloatSym,
    mul,
    ret,
    sym,
    vec2,
    Vec2Sym,
    Vec2Term,
    vec3
} from "@thi.ng/shader-ast";
import { cossin } from "./sincos";

/**
 * Converts 2D polar vector `v` to cartesian coordinates. See `polar2()`
 * for reverse operation.
 *
 * @param v
 */
export const cartesian2 = (v: Vec2Term) => mul(cossin($y(v)), vec2($x(v)));

/**
 * Converts 3D polar vector `v` to cartesian coordinates. See `polar3()`
 * for reverse operation.
 *
 * @param v
 */
export const cartesian3 = defn("vec3", "cartesian3", [["vec3"]], (v) => {
    let r: FloatSym;
    let t: Vec2Sym;
    let p: Vec2Sym;
    return [
        (r = sym($x(v))),
        (t = sym(cossin($y(v)))),
        (p = sym(cossin($z(v)))),
        ret(vec3(mul(mul(r, $x(t)), $x(p))))
    ];
});