import { start } from "@thi.ng/hdom";
import { notification } from "@thi.ng/hdom-components/notification";
import { HEADER_CHEVRON } from "@thi.ng/hiccup-carbon-icons/header-chevron";
import { HEADER_CLOSE } from "@thi.ng/hiccup-carbon-icons/header-close";
import { INFO } from "@thi.ng/hiccup-carbon-icons/info";
import { css } from "@thi.ng/hiccup-css/css";
import { animation } from "@thi.ng/hiccup-css/animation";
import { injectStyleSheet } from "@thi.ng/hiccup-css/inject";

const LOREM_IPSUM =
    `Aute ea nisi ut nostrud consectetur officia cillum dolore eu enim Lorem.
    Pariatur fugiat ullamco veniam velit nostrud dolore cillum.
    Ea cillum nulla ipsum laboris irure fugiat amet nostrud aliqua ea.
    Nisi mollit sit aute do veniam ut tempor ut.
    Tempor eiusmod dolor aliquip sint dolor ex in et cillum culpa.
    Minim excepteur tempor enim eiusmod sint veniam consequat laborum minim id
    nisi non ex exercitation. Occaecat ut magna amet et consectetur sit eu.`;

injectStyleSheet(css([
    animation("fade-in", {},
        {
            opacity: 0,
            transform: "translateY(-0.5rem)"
        },
        {
            opacity: 1,
            transform: "translateY(0)"
        }
    ),
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
    }]
]));

const theme = {
    accordion: {
        root: { class: "mv3" },
        title: { class: "pointer fw6 ma0 mt2 pv2 ph3 bb b--gray.dim" },
        bodyOpen: { class: "gray bg-near-white pa3 mt2" },
        bodyClosed: { class: "ph3" },
    },
    codeblock: { class: "code bg-washed-yellow black pa3 f7 overflow-x-scroll" }
};

const state = [false, false, false, false];

const toggleSection = (id) => state[id] = !state[id];

const toggleSingleSection = (id) =>
    state[id] ?
        state[id] = false :
        (state.fill(false), state[id] = true);

const customizedIcon =
    (icon, fill, width) =>
        ["span.dib.w1.h1.mr2",
            ["svg.mr2",
                { viewBox: icon[1].viewBox, fill, width, height: width },
                ...icon.slice(2)]];

const accordion =
    (ctx, onclick, ...sections) =>
        ["div", ctx.accordion.root,
            sections.map((panel, i) => [accordionPanel, onclick, i, panel])];

const accordionPanel =
    (ctx, onclick, id, { open, title, body }) =>
        ["div",
            ["h4",
                { ...ctx.accordion.title, onclick: () => onclick(id) },
                customizedIcon(open ? HEADER_CLOSE : HEADER_CHEVRON, "#555", "80%"),
                title],
            open ?
                ["div.panel.panel-active",
                    ["div.content", ctx.accordion.bodyOpen, ...body]] :
                ["div.panel",
                    ["div.content", ctx.accordion.bodyClosed]]
        ];

const info = notification({
    attribs: { class: "bg-light-blue dark-blue mv3 pv2 ph3" },
    icon: customizedIcon(INFO, "#00449e", "80%"),
});

const codeblock = (ctx, body) =>
    ["pre", ctx.codeblock, body];

const cancel = start(() =>
    ["div.mw7.center",
        ["h1.ma0.pt3.ph3", "Accordion component"],
        [accordion, toggleSingleSection,
            {
                open: state[0],
                title: "Hello World",
                body: [LOREM_IPSUM]
            },
            {
                open: state[1],
                title: "Notification test",
                body: [
                    "We're interrupting this program for some special bulletin...",
                    [info, {}, ["span", "Bought to you by ", ["b", "thi.ng/umbrella"]]],
                    LOREM_IPSUM,
                ]
            },
            {
                open: state[2],
                title: "Code example",
                body: [
                    LOREM_IPSUM,
                    [codeblock, `[accordion, onClickHandler,
    {
        open: true,
        title: "Panel #1 title",
        body: ["Any body content you wish..."]
    },
    {
        open: false,
        title: "Panel #1 title",
        body: [["p", "Multiple child elements"], ["p", "More..."]]
    },
    {
        open: false,
        title: "Panel #3 title",
        body: [["img.w-100", { src: "https://dummyimage.com/16:9x360/" }]]
    }
]`]
                ]
            },
            {
                open: state[3],
                title: "Finally...",
                body: [
                    LOREM_IPSUM,
                    ["p", ["a.link.black", { href: "https://github.com/thi-ng/umbrella/tree/master/examples/hdom-accordion" }, "Source code"]]]
            },
        ]
    ],
    { ctx: theme }
);

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(cancel);
}
