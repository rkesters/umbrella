import { COPY } from "@thi.ng/hiccup-carbon-icons/copy";
import { copyToClipboard } from "./copy-clipboard";
import { iconButton } from "./icon";
import { Event } from "./state";

declare const hljs: any;

/**
 * Context-themed HOF code block component with copy-to-clipboard button
 * & implementation.
 */
export const codeblock = () => ({
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
        return ["div", ctx.theme.codeblock.root,
            ["pre", { ...ctx.theme.codeblock.code, __skip: this.inited }, [`code.${lang}`, body]],
            ["div", ctx.theme.codeblock.buttonWrapper,
                this.copied ?
                    ["span", ctx.theme.codeblock.confirmation, "Copied"] :
                    [iconButton, () => this.oncopy(ctx, body), COPY]
            ]
        ];
    },
    oncopy(ctx, body) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        let success = copyToClipboard(body);
        if (success) {
            this.copied = true;
            this.timer = setTimeout(() => {
                this.copied = false;
                ctx.bus.dispatch([Event.UPDATE_UI]);
            }, 1000);
            ctx.bus.dispatch([Event.UPDATE_UI]);
        } else {
            alert("Couldn't copy to clipboard");
        }
    }
});
