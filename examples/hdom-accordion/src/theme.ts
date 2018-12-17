import { css } from "@thi.ng/hiccup-css/css";
import { injectStyleSheet } from "@thi.ng/hiccup-css/inject";

injectStyleSheet(css([
    [".panel", {
        overflow: "hidden",
        transition: "all .25s ease-in-out"
    }],
    [".content", {
        transition: "all .3s ease-in-out",
        "max-height": 0,
        visibility: "hidden",
        opacity: 0,
    }],
    [".panel-active .content", {
        transition: "all .3s ease-in-out",
        "max-height": "40rem",
        visibility: "visible",
        opacity: 1,
    }],
    [".icon-button svg:hover *", {
        fill: "#357edd",
        transition: "fill 0.15s ease-in-out"
    }]
]));

export const THEME = {
    accordion: {
        root: { class: "mv3" },
        title: { class: "pointer fw6 ma0 mt2 pv2 ph3 bb b--gray.dim" },
        bodyOpen: { class: "gray bg-near-white pa3 mt2" },
        bodyClosed: { class: "ph3" },
    },
    codeblock: {
        root: { class: "relative f7" },
        code: { class: "code bg-washed-yellow black pa3 f7 overflow-x-scroll" },
        buttonWrapper: { class: "absolute top-1 right-1" },
        confirmation: { class: "bg-blue white ph2 pv1" },
    },
    iconButton: {
        attribs: { class: "icon-button pointer black" },
        fill: "#000"
    },
    link: { class: "link black b" },
};
