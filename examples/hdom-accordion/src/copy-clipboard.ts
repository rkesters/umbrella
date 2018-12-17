/**
 * Helper function to copy given text to clipboard.
 *
 * https://stackoverflow.com/a/30810322/294515
 *
 * @param body
 */
export const copyToClipboard =
    (body: string) => {
        let success;
        const el = document.createElement("textarea");
        el.style.position = "fixed";
        el.style.top = "-9999px;";
        el.value = body;
        document.body.appendChild(el);
        el.focus();
        el.select();
        try {
            success = document.execCommand("copy");
        }
        catch (_) { }
        document.body.removeChild(el);
        return success;
    };
