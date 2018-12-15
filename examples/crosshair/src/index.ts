import { start } from "@thi.ng/hdom";
import { crosshair } from "@thi.ng/hdom-components/crosshair";

let x = 100;
let y = 100;

window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
});

const cancel = start(() =>
    ["div.vh-100.flex.flex-column.justify-center.bg-near-black.sans-serif",
        { style: { cursor: "none" } },
        // dummy content
        ["div.tc",
            ["h1.f-headline.white.ma0", "HELLO!"],
            ["button.bg-white.black.pa2",
                { onclick: () => alert("hi!") },
                "Click me"]],
        // use xy offset of -1 for crosshair position
        // to allow click events reach other elements
        [crosshair,
            { style: { "mix-blend-mode": "difference" } },
            { color: "#f00" },
            x - 1, y - 1]
    ]);

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(cancel);
}
