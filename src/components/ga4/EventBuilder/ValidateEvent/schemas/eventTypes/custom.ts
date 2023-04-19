// Custom Schema.

// Custom events are not known event names.
// If a known field is sent as part of a custom event, same validation rules apply
// ex: if value is provided, value must be number, and valid currency field is
// required

import { VALUE_CURRENCY_DEPENDENCY } from "./fieldDefinitions"
import { getAllEventProperties } from "./eventBuilder"


export const customSchema = {
    "type": "object",
    "required": [],
    "maxProperties": 25,
    "patternProperties": {
        ".": {
            "maxLength": 100
        }
    },
    "propertyNames": {
        "pattern": "^(?!ga_|google_|firebase_)[A-Za-z][A-Za-z0-9_]*$",
        "maxLength": 40
    },
    "properties": getAllEventProperties(),
    "dependencies": VALUE_CURRENCY_DEPENDENCY
}
