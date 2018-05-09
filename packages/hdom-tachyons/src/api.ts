export interface ThemeSpec {
    global: {
        bodyBg: string;
        bodyText: string;
        disabled: string;
        highlight: string;
        selected: string;
    },
    buttons: {
        default: ButtonSpec;
        alt: ButtonSpec;
        [id: string]: ButtonSpec;
    },
    buttonGroups: {
        horizontal: {
            default: ButtonGroupSpec;
            alt: ButtonGroupSpec;
            [id: string]: ButtonGroupSpec;
        };
        vertical: {
            default: ButtonGroupSpec;
            alt: ButtonGroupSpec;
            [id: string]: ButtonGroupSpec;
        }
    }
}

export type ButtonState = "default" | "disabled" | "selected";
export type ButtonSize = "normal" | "small" | "large";

export interface ButtonSpec extends Record<ButtonSize, Partial<ButtonSizeOpts>> {
    states: Record<ButtonState, string>;
    common: string;
}

export interface ButtonSizeOpts {
    margin: string;
    padding: string;
    font: string;
    fontSize: string;
    border: string;
    radius: string;
    extra: string;
}

export type ButtonGroupItem = "first" | "inner" | "last";

export interface ButtonGroupSpec extends Record<ButtonSize, ButtonGroupSizeOpts> {
    root: string;
    button: {
        states: Record<ButtonState, string>;
        common: string;
    }
}

export interface ButtonGroupSizeOpts extends Record<ButtonGroupItem, Partial<ButtonGroupSizeAttribs>> {
    common: string;
}

export interface ButtonGroupSizeAttribs {
    radius: string;
    border: string;
    margin: string;
    padding: string;
    extra: string;
}
