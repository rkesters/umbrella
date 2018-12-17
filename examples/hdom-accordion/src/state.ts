import { Atom } from "@thi.ng/atom";
import { FX_STATE } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { valueUpdater, dispatchNow } from "@thi.ng/interceptors/interceptors";
import { updateIn } from "@thi.ng/paths";

export enum Event {
    TOGGLE_PANEL_MULTI,
    TOGGLE_PANEL_SINGLE,
    UPDATE_UI
};

export const BUS = new EventBus(
    // central app state
    new Atom({
        panels: [false, false, false, false],
        updates: 0,
    }),
    // event handlers
    {
        // toggles a single panel, but allows multiple open
        [Event.TOGGLE_PANEL_MULTI]: [
            (state, [_, id]) => ({
                [FX_STATE]: updateIn(state, ["panels", id], (x) => !x)
            }),
            dispatchNow([Event.UPDATE_UI])
        ],

        // toggles a single panel, but closes all others
        [Event.TOGGLE_PANEL_SINGLE]: [
            valueUpdater("panels", (panels: boolean[], id: number) => {
                const res = new Array(panels.length).fill(false);
                !panels[id] && (res[id] = true);
                return res;
            }),
            dispatchNow([Event.UPDATE_UI])
        ],

        // increases UI update counter
        [Event.UPDATE_UI]: valueUpdater("updates", (x: number) => x + 1),
    }
);
