import { start } from "@thi.ng/hdom";
import { accordion } from "./accordion";
import { PANELS } from "./content";
import { BUS, Event } from "./state";
import { THEME } from "./theme";

const app =
    (ctx) =>
        ctx.bus.processQueue() ?
            ["div.mw7.center",
                ["h1.ma0.pt3.ph3", "Accordion component"],
                [accordion,
                    (id) => ctx.bus.dispatch([Event.TOGGLE_PANEL_SINGLE, id]),
                    (id) => ctx.bus.state.value.panels[id],
                    ...PANELS],
                ["div.f7", `${ctx.bus.state.value.updates} redraws`]
            ] :
            null;

BUS.dispatch([Event.UPDATE_UI]);

const cancel = start(app, { ctx: { theme: THEME, bus: BUS } });

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(cancel);
}
