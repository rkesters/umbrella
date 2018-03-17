export interface Theme {
    button: ButtonOpts;
}

export interface ButtonOpts {
    class: string;
}

export interface ButtonGroupOpts {
    first: ButtonOpts;
    main: ButtonOpts;
    last: ButtonOpts;
}
