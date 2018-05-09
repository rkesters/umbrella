export interface ThemeSpec {
    global: {
        bodyBg: string;
        bodyText: string;
        disabled: string;
        highlight: string;
        selected: string;
    },
    buttons: {
        primary: ButtonSpec;
        secondary: ButtonSpec;
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

export interface ColorStates extends Array<string> {
    [0]: string;
    [1]?: string;
}
