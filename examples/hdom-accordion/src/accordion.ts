import { HEADER_CHEVRON } from "@thi.ng/hiccup-carbon-icons/header-chevron";
import { HEADER_CLOSE } from "@thi.ng/hiccup-carbon-icons/header-close";
import { iconWrapper } from "./icon";

/**
 * Context-themed accordion component. Takes an `onclick` event handler
 * and `panelOpen` predicate (both of which are only being given a panel
 * ID) and any number of panel objects of `{ title, body }`.
 *
 * @param ctx
 * @param onclick
 * @param panelOpen
 * @param sections
 */
export const accordion =
    (ctx, onclick, panelOpen, ...sections) =>
        ["div", ctx.theme.accordion.root,
            sections.map((panel, i) => [accordionPanel, onclick, i, panelOpen(i), panel])];

const accordionPanel =
    (ctx, onclick, id, open, { title, body }) =>
        ["div",
            ["h4",
                { ...ctx.theme.accordion.title, onclick: () => onclick(id) },
                iconWrapper(open ? HEADER_CLOSE : HEADER_CHEVRON, "#555", "80%"),
                title],
            open ?
                ["div.panel.panel-active",
                    ["div.content", ctx.theme.accordion.bodyOpen, ...body]] :
                ["div.panel",
                    ["div.content", ctx.theme.accordion.bodyClosed]]
        ];
