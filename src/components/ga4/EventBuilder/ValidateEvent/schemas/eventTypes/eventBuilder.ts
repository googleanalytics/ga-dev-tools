// event builder module for building generic event wrappers.

import { EVENT_FIELDS, VALUE_CURRENCY_DEPENDENCY } from "./fieldDefinitions"
import { itemsSchema } from "./items"

export const getAllEventProperties = () => {
  let knownFields = EVENT_FIELDS
  // @ts-ignore
  knownFields["items"] = itemsSchema
  return knownFields
}

export const getEventSchema = (requiredFields: any) => {
    return {
        "type": "object",
        "required": requiredFields,
        "properties": getAllEventProperties(),
        "dependencies": VALUE_CURRENCY_DEPENDENCY,
        "propertyNames": {
            "pattern": "^(?!ga_|google_|firebase_)[A-Za-z][A-Za-z0-9_]*$",
            "maxLength": 40
        }
    }
}