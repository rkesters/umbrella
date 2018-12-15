import { mergeAttribs } from "./utils/merge-attribs";

export interface CrosshairOpts {
    top: string;
    left: string;
    width: string;
    height: string;
    z: number;
    color: string;
    borderStyle: string;
}

export const crosshair =
    (_, attribs: any, opts: Partial<CrosshairOpts>, x: number, y: number) => {
        opts = {
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100vh",
            color: "#000",
            borderStyle: "dashed",
            z: 999,
            ...opts
        };
        return ["div",
            mergeAttribs({ style: { "z-index": opts.z } }, attribs),
            ["div",
                {
                    style: {
                        position: "fixed",
                        width: "1px",
                        height: opts.height,
                        top: opts.top,
                        left: `${x}px`,
                        "border-color": opts.color,
                        "border-width": "0 0 0 1px",
                        "border-style": opts.borderStyle,
                    }
                }],
            ["div",
                {
                    style: {
                        position: "fixed",
                        width: opts.width,
                        height: "1px",
                        top: `${y}px`,
                        left: opts.left,
                        "border-color": opts.color,
                        "border-width": "0 0 1px 0",
                        "border-style": opts.borderStyle,
                    }
                }]
        ];
    };
