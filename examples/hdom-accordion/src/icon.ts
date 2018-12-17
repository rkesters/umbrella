/**
 * Not a component. Wraps given SVG icon in a fixed size span and
 * customizes fill color.
 *
 * @param icon
 * @param fill
 * @param width
 * @param attribs
 */
export const iconWrapper =
    (icon, fill, width, attribs: any = { class: "mr2" }) =>
        ["span.dib.w1.h1", attribs,
            ["svg",
                { viewBox: icon[1].viewBox, fill, width, height: width },
                ...icon.slice(2)]];

/**
 * Context-themed link component wrapping given raw `icon` and `label`
 * and attaches `onclick` handler.
 *
 * @param ctx
 * @param onclick
 * @param icon
 * @param label
 */
export const iconButton =
    (ctx, onclick, icon, label) =>
        ["a", { ...ctx.theme.iconButton.attribs, onclick },
            iconWrapper(icon, ctx.theme.iconButton.fill, "80%"),
            label
        ];
