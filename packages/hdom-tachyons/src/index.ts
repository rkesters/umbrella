import { getIn } from "@thi.ng/paths";
import { resolveMap } from "@thi.ng/resolve-map";
// import { Theme } from "@thi.ng/hdom-components";

export enum Align {
    LEFT,
    CENTER,
    RIGHT,
}

export interface ThemeOpts {
    button: {
        bg: ColorStates;
        fg: ColorStates;
        padding: number[];
        margin: number[];
        radius: number | string;
    },
    buttonGroup: {
        bg: ColorStates;
        fg: ColorStates;
        padding: number[];
        margin: number[];
        first: {
            radius: number | string;
        },
        last: {
            radius: number | string;
        },
        align: Align;
    }
}

export interface ColorStates {
    default: string;
    active: string;
    hover: string;
    visited?: string;
}

const alignments = {
    [Align.LEFT]: "tl",
    [Align.CENTER]: "tc",
    [Align.RIGHT]: "tr",
};

export const BASE: ThemeOpts = resolveMap({
    button: {
        bg: {
            default: "black",
            active: "blue",
            hover: "blue",
        },
        fg: {
            default: "white",
            active: "->default",
            hover: "->default",
        },
        padding: [2, 2],
        margin: [2, 2],
        radius: 2,
        align: Align.CENTER,
        width: 4,
    },
    buttonGroup: {
        bg: "->/button.bg",
        fg: "->/button.fg",
        padding: [3, 1],
        margin: [2, 0],
        first: {
            radius: "-pill",
        },
        last: {
            radius: "-pill",
        },
        align: true,
    }
});

const lookup = (user, root?) => {
    let base;
    if (root) {
        base = BASE[root];
        user = user[root];
    } else {
        base = BASE;
    }
    return (path) => getIn(user, path) || getIn(base, path);
}

const cond = (prefix, val) =>
    val != null ? prefix + val : undefined;

const format = (classes: string[]) =>
    classes.filter(x => x != null).join(" ");

export const button = (user, root) => {
    const $ = lookup(user, root);
    return format([
        "link",
        cond("", alignments[$("align")]),
        cond("ph", $("padding.0")),
        cond("pv", $("padding.1")),
        cond("bg-", $("bg.default")),
        cond("hover-bg-", $("bg.hover")),
        cond("", $("fg.default")),
        cond("hover-", $("fg.hover")),
        "bg-animate",
        cond("br", $("radius"))
    ]);
}

export const makeTheme = (opts: ThemeOpts) => {
    const $ = lookup(opts);
    return resolveMap({
        button: {
            class: button(opts, "button"),
        },
        buttonGroupH: {
            main: {
                class: button(opts, "buttonGroup"),
            },
            first: {
                class: (_) => `${_("buttonGroupH.main.class")} br${$("buttonGroup.first.radius")} br--left`
            },
            last: {
                class: (_) => `${_("buttonGroupH.main.class")} br${$("buttonGroup.last.radius")} br--right`
            }
        },
        buttonGroupV: {
            main: "->/buttonGroupH.main",
            first: {
                class: (_) => `${_("buttonGroupV.main.class")} br${$("buttonGroup.first.radius")} br--top`
            },
            last: {
                class: (_) => `${_("buttonGroupV.main.class")} br${$("buttonGroup.last.radius")} br--bottom`
            }
        }
    });
};
