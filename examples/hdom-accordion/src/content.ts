import { codeblock } from "./codeblock";
import { ghlink } from "./ghlink";
import { info, warning } from "./notification";

// this file only defines static content

const LOREM_IPSUM =
    `Aute ea nisi ut nostrud consectetur officia cillum dolore eu enim Lorem.
    Pariatur fugiat ullamco veniam velit nostrud dolore cillum.
    Ea cillum nulla ipsum laboris irure fugiat amet nostrud aliqua ea.
    Nisi mollit sit aute do veniam ut tempor ut.
    Tempor eiusmod dolor aliquip sint dolor ex in et cillum culpa.
    Minim excepteur tempor enim eiusmod sint veniam consequat laborum minim id
    nisi non ex exercitation. Occaecat ut magna amet et consectetur sit eu.`;

// accordion panels
export const PANELS = [
    {
        title: "Hello World",
        body: [LOREM_IPSUM]
    },
    {
        title: "Notification test",
        body: [
            "We're interrupting this program for some special bulletin...",
            [info, {}, ["span", "Bought to you by ", ["b", "thi.ng/umbrella"]]],
            LOREM_IPSUM,
            [warning, {}, ["span", "Eternally in beta!"]],
        ]
    },
    {
        title: "Code example",
        body: [
            "The following code block component uses ", ["code.f7.bg-washed-green.pa1", "highlight.js"],
            " for syntax highlighting and provides copy-to-clipboard functionality...",
            [codeblock(), "js", `[accordion, onClickHandler, panelOpen,
    // panel definitions
    {
        title: "Panel #1 title",
        body: ["Any body content you wish..."]
    },
    {
        title: "Panel #2 title",
        body: [["p", "Multiple child elements"], ["p", "More..."]]
    },
    {
        title: "Panel #3 title",
        body: [["img.w-100", { src: "https://dummyimage.com/16:9x360/" }]]
    }
]`],
            "foo bar:",
            [codeblock(), "js", `const foo = () => "bar";`],
        ]
    },
    {
        title: "Finally...",
        body: [
            LOREM_IPSUM,
            ["p",
                "Check out the ",
                [ghlink, "thi-ng/umbrella/tree/feature/hdc-tachyons/examples/hdom-accordion", "source code"],
                " of this example..."]
        ]
    },
];
