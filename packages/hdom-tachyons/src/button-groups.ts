import { button } from "@thi.ng/hdom-components/button";
import { buttonGroup as rawButtonGroup, ButtonGroup } from "@thi.ng/hdom-components/button-group";

import {
    ButtonGroupItem,
    ButtonGroupSpec,
    ButtonSize,
    ButtonState
} from "./api";

const classes = (spec: ButtonGroupSpec, size: ButtonSize, type: ButtonGroupItem, state: ButtonState) => {
    const res = [];
    let v;
    (v = spec.button.common) && res.push(v);
    (v = spec.button.states[state]) && res.push(v);
    const sspec = spec[size];
    (v = sspec.common) && res.push(v);
    const tspec = sspec[type];
    for (let k in tspec) {
        (v = tspec[k]) != null && res.push(v);
    }
    state !== "disabled" && res.push("pointer link");
    return res.join(" ");
};

const bt = (spec: ButtonGroupSpec, size: ButtonSize, type: ButtonGroupItem) => {
    return button({
        attribs: {
            class: classes(spec, size, type, "default"),
            href: "#"
        },
        attribsDisabled: {
            class: classes(spec, size, type, "disabled"),
        }
    });
};

export const buttonGroup = (theme: ButtonGroupSpec, size: ButtonSize, extra = ""): ButtonGroup => {
    extra.length && (extra = " " + extra);
    return rawButtonGroup({
        attribs: { class: theme.root + extra },
        first: bt(theme, size, "first"),
        inner: bt(theme, size, "inner"),
        last: bt(theme, size, "last"),
    });
};
