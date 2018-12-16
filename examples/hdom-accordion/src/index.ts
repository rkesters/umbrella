import { start } from "@thi.ng/hdom";
import { notification } from "@thi.ng/hdom-components/notification";
import { COPY } from "@thi.ng/hiccup-carbon-icons/copy";
import { HEADER_CHEVRON } from "@thi.ng/hiccup-carbon-icons/header-chevron";
import { HEADER_CLOSE } from "@thi.ng/hiccup-carbon-icons/header-close";
import { INFO } from "@thi.ng/hiccup-carbon-icons/info";
import { css } from "@thi.ng/hiccup-css/css";
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

const theme = {
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

// ultra basic way to store the open/closed state of each accordion panel
const state = [false, false, false, false];

// event handler for toggling a single panel, but allowing multiple expanded
const togglePanelMulti = (id) => state[id] = !state[id];

// event handler for toggling a single panel, but closing any other
const togglePanelSingle = (id) =>
    state[id] ?
        state[id] = false :
        (state.fill(false), state[id] = true);

// wraps given icon in a fixed size span and customizes color
const iconWrapper =
    (icon, fill, width, attribs: any = { class: "mr2" }) =>
        ["span.dib.w1.h1", attribs,
            ["svg",
                { viewBox: icon[1].viewBox, fill, width, height: width },
                ...icon.slice(2)]];

const iconButton =
    (ctx, onclick, icon, label) =>
        ["a", { ...ctx.iconButton.attribs, onclick },
            iconWrapper(icon, ctx.iconButton.fill, "80%"),
            label
        ];

// accordion component
// takes an event handler (which is only given a panel ID to toggle)
// and any number of panel objects of `{ open, title, body }`
const accordion =
    (ctx, onclick, ...sections) =>
        ["div", ctx.accordion.root,
            sections.map((panel, i) => [accordionPanel, onclick, i, panel])];

const accordionPanel =
    (ctx, onclick, id, { open, title, body }) =>
        ["div",
            ["h4",
                { ...ctx.accordion.title, onclick: () => onclick(id) },
                iconWrapper(open ? HEADER_CLOSE : HEADER_CHEVRON, "#555", "80%"),
                title],
            open ?
                ["div.panel.panel-active",
                    ["div.content", ctx.accordion.bodyOpen, ...body]] :
                ["div.panel",
                    ["div.content", ctx.accordion.bodyClosed]]
        ];

// create a pre-configured notification component
const info = notification({
    attribs: { class: "bg-light-blue dark-blue mv3 pv2 ph3" },
    icon: iconWrapper(INFO, "#00449e", "80%"),
});

declare const hljs: any;

// code block component w/ copy to clipboard feature
const codeblock = {
    init(el) {
        hljs.highlightBlock(el.children[0]);
        this.inited = true;
    },
    release() {
        this.inited = false;
        this.copied = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    },
    render(ctx, lang, body) {
        return ["div", ctx.codeblock.root,
            ["pre", { ...ctx.codeblock.code, __skip: this.inited }, [`code.${lang}`, body]],
            ["div", ctx.codeblock.buttonWrapper,
                this.copied ?
                    ["span", ctx.codeblock.confirmation, "Copied"] :
                    [iconButton, () => this.oncopy(body), COPY]
            ]
        ];
    },
    oncopy(body) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        // https://stackoverflow.com/a/30810322/294515
        const el = document.createElement("textarea");
        el.style.position = "fixed";
        el.style.top = "-9999px;";
        el.value = body;
        document.body.appendChild(el);
        el.focus();
        el.select();
        let success;
        try {
            success = document.execCommand("copy");
        } catch (_) { }
        document.body.removeChild(el);
        if (success) {
            this.copied = true;
            this.timer = setTimeout(() => this.copied = false, 1000);
        } else {
            alert("Couldn't copy to clipboard");
        }
    }
};

const ghlink =
    (ctx, path, label) =>
        ["a", { ...ctx.link, href: `https://github.com/${path}` }, label || path];

const cancel = start(() =>
    ["div.mw7.center",
        ["h1.ma0.pt3.ph3", "Accordion component"],
        [accordion, togglePanelSingle,
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
                    "The following code block component uses ", ["code", "highlight.js"],
                    " for syntax highlighting and provides copy-to-clipboard functionality...",
                    [codeblock, "js", `[accordion, onClickHandler,
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
                    ["p",
                        [ghlink, "thi-ng/umbrella/tree/feature/hdc-tachyons/examples/hdom-accordion", "Source code"]]
                ]
            },
        ]
    ],
    { ctx: theme }
);

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(cancel);
}
