import { resolveMap } from "@thi.ng/resolve-map";
import { ThemeSpec } from "./api";

export const DEFAULT: ThemeSpec = resolveMap({
    global: {
        bodyBg: "white",
        bodyText: "dark-gray",
        disabled: "gray",
        hover: "red",
        selected: "light-blue",
    },
    buttons: {
        primary: {
            states: {
                disabled: ($) => `moon-gray bg-${$("/global/disabled")}`,
                default: ($) => `white bg-${$("/global/bodyText")} hover-bg-${$("/global/hover")} bg-animate`,
                selected: ($) => `white bg-${$("/global/selected")} hover-bg-${$("/global/hover")} bg-animate`,
            },
            common: "dib",
            normal: {
                margin: "mr2 mb2",
                padding: "ph3 pv2",
                radius: "br-pill",
            },
            small: {
                margin: "mr1 mb1",
                padding: "ph3 pv1",
                radius: "br-pill",
                fontSize: "f7",
            },
            large: {
                margin: "mr2 mb2",
                padding: "ph4 pv3",
                radius: "br-pill",
                fontSize: "f4",
            }
        },
        secondary: ($) => ({
            ...$("primary"),
            states: {
                disabled: $("/global/disabled"),
                default: `${$("/global/bodyText")} hover-bg-${$("/global/hover")} hover-white bg-animate`,
                selected: `${$("/global/selected")} hover-bg-${$("/global/hover")} hover-white bg-animate`
            },
            common: "dib ba",
        })
    }
});
