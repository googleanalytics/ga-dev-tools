// Item Schema.
// https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#purchase_item

import { ITEM_FIELDS } from "./fieldDefinitions"

export const itemSchema = {
    "type": "object",
    "required": [],
    "patternProperties": {
        ".": {
            "maxLength": 100
        }
    },
    "propertyNames": {
        "maxLength": 40
    },
    "properties": ITEM_FIELDS,
    "anyOf": [{
        "required": ["item_id"]
    }, {
        "required": ["item_name"]
    }]
}