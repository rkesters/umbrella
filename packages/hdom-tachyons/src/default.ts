export const DEFAULT = {
    global: {
        bodyBg: "white",
        bodyText: "dark-gray",
        disabled: "gray",
        disabledAlt: "moon-gray",
        controlBg: "@bodyText",
        controlFg: "@bodyBg",
        hover: "red",
        hoverAlt: "washed-red",
        selected: "light-blue",
    },
    buttons: {
        default: {
            states: {
                disabled: ($) => `${$("/global/disabledAlt")} bg-${$("/global/disabled")}`,
                default: ($) => `${$("/global/controlFg")} bg-${$("/global/controlBg")} hover-${$("/global/hoverAlt")} hover-bg-${$("/global/hover")} bg-animate`,
                selected: ($) => `${$("/global/controlFg")} bg-${$("/global/selected")} hover-${$("/global/hoverAlt")} hover-bg-${$("/global/hover")} bg-animate`,
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
        alt: ($) => ({
            ...$("default"),
            states: {
                disabled: $("/global/disabled"),
                default: `${$("/global/bodyText")} hover-${$("/global/hoverAlt")} hover-bg-${$("/global/hover")} bg-animate`,
                selected: `${$("/global/selected")} hover-${$("/global/hoverAlt")} hover-bg-${$("/global/hover")} bg-animate`
            },
            common: "dib ba",
        })
    },
    buttonGroups: {
        horizontal: {
            default: {
                root: "dib mr2 mb2",
                button: {
                    states: "@/buttons/default/states",
                    common: "dib",
                },
                normal: {
                    common: "ph3 pv2",
                    first: {
                        radius: "br-pill br--left",
                        border: "br b--mid-gray",
                    },
                    inner: {
                        border: "@../first/border",
                    },
                    last: {
                        radius: "br-pill br--right",
                    }
                },
                small: ($) => ({
                    ...$("normal"),
                    common: "ph3 pv1 f7",
                }),
                large: ($) => ({
                    ...$("normal"),
                    common: "ph4 pv3 f4",
                })
            },
            alt: {
                root: "@../default/root",
                button: {
                    states: "@/buttons/alt/states",
                    common: "@../../default/button/common",
                },
                normal: {
                    common: "@../../default/normal/common",
                    first: {
                        radius: "br-pill br--left",
                        border: "ba b--mid-gray",
                    },
                    inner: {
                        border: "bt bb br b--mid-gray",
                    },
                    last: {
                        radius: "br-pill br--right",
                        border: "bt bb br b--mid-gray",
                    }
                },
                small: ($) => ({
                    ...$("normal"),
                    common: $("../default/small/common"),
                }),
                large: ($) => ({
                    ...$("normal"),
                    common: $("../default/large/common"),
                })
            },
        }
    }
};
