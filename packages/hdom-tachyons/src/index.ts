import { getIn } from "@thi.ng/atom/path";
// import { Theme } from "@thi.ng/hdom-components";

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
        }
    }
}

export interface ColorStates {
    default: string;
    active: string;
    hover: string;
    visited?: string;
}

export const BASE: ThemeOpts = {
    button: {
        bg: {
            default: "black",
            active: "blue",
            hover: "gray",
        },
        fg: {
            default: "white",
            active: "white",
            hover: "white",
        },
        padding: [2, 2],
        margin: [2, 2],
        radius: 2,
    },
    buttonGroup: {
        bg: {
            default: "black",
            active: "blue",
            hover: "gray",
        },
        fg: {
            default: "white",
            active: "white",
            hover: "white",
        },
        padding: [3, 1],
        margin: [3, 1],
        first: {
            radius: "-pill",
        },
        last: {
            radius: "-pill",
        }
    }
};

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

export const button = (user, root) => {
    const $ = lookup(user, root);
    const r = $("radius");
    return [
        "link",
        "ph" + $("padding.0"),
        "pv" + $("padding.1"),
        "bg-" + $("bg.default"),
        "hover-bg-" + $("bg.hover"),
        $("fg.default"),
        "hover-" + $("fg.hover"),
        "bg-animate",
        r ? "br" + r : "",
    ].join(" ");
}

export const makeTheme = (opts: ThemeOpts) => {
    const $ = lookup(opts);
    const btgroup = button(opts, "buttonGroup");
    const theme = {
        button: {
            class: button(opts, "button"),
        },
        buttonGroupH: {
            main: {
                class: btgroup,
            },
            first: {
                class: btgroup + ` br${$("buttonGroup.first.radius")} br--left`
            },
            last: {
                class: btgroup + ` br${$("buttonGroup.last.radius")} br--right`
            }
        },
        buttonGroupV: {
            main: {
                class: btgroup,
            },
            first: {
                class: btgroup + ` br${$("buttonGroup.first.radius")} br--top`
            },
            last: {
                class: btgroup + ` br${$("buttonGroup.last.radius")} br--bottom`
            }
        }
    };

    return theme;
};
