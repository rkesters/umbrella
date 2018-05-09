import { button as rawButton, Button } from "@thi.ng/hdom-components/button";

import { ButtonSpec, ButtonSize, ButtonState } from "./api";

const classes = (theme: ButtonSpec, size: ButtonSize, state: ButtonState) => {
    const res = [];
    let v;
    (v = theme.common) && res.push(v);
    (v = theme.states[state]) && res.push(v);
    const spec = theme[size];
    for (let k in spec) {
        if ((v = spec[k]) != null) {
            res.push(v);
        }
    }
    state !== "disabled" && res.push("pointer link");
    return res.join(" ");
};

export const button = (theme: ButtonSpec, size: ButtonSize, extra = ""): Button => {
    extra.length && (extra = " " + extra);
    return rawButton({
        attribs: {
            class: classes(theme, size, "default") + extra,
            href: "#"
        },
        attribsDisabled: {
            class: classes(theme, size, "disabled") + extra,
        }
    });
};
