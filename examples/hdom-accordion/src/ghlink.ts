/**
 * Link component for GitHub URLs.
 *
 * @param ctx
 * @param path
 * @param label
 */
export const ghlink =
    (ctx, path, label) =>
        ["a",
            { ...ctx.theme.link, href: `https://github.com/${path}` },
            label || path];
