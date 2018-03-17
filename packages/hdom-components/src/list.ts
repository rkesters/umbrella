/**
 *
 * @param body
 */
export const listItem = (body) => ["li", {}, body];

/**
 *
 * @param attribs
 */
export const listItemWithAttribs = (attribs) => (body) => ["li", attribs, body];

/**
 *
 * @param listType
 * @param tx
 */
export const list = (listType: string, attribs: any, tx = listItem) => (...items: any[]) => [listType, attribs, ...items.map(tx)];
