import { notification } from "@thi.ng/hdom-components/notification";
import { INFO } from "@thi.ng/hiccup-carbon-icons/info";
import { WARNING_OUTLINE } from "@thi.ng/hiccup-carbon-icons/warning-outline";
import { iconWrapper } from "./icon";

/**
 * Pre-configured notification component.
 */
export const info = notification({
    attribs: { class: "bg-light-blue dark-blue mv3 pv2 ph3" },
    icon: iconWrapper(INFO, "#00449e", "80%"),
});

/**
 * Pre-configured notification component.
 */
export const warning = notification({
    attribs: { class: "bg-washed-red dark-red mv3 pv2 ph3" },
    icon: iconWrapper(WARNING_OUTLINE, "#e7040f", "80%"),
});
