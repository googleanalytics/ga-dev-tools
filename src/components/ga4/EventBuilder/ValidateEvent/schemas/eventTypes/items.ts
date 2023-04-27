// Items Schema.
// https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#purchase_item

import {itemSchema} from "./item"

export const itemsSchema = {"type": "array", "minItems": 1, "items": itemSchema}
