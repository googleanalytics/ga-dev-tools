import { buildEvents } from "./schemaBuilder"

export const eventSchema = {
    "type": "object",
    "maxProperties": 25,
    "required": ["name", "params"],
    "additionalProperties": false,
    "properties": {
        "name": {
            "type": "string",
            "format": "event_name",
            "pattern": "^[A-Za-z][A-Za-z0-9_]*$",
            "maxLength": 40
        },
        "params": {"type": "object"}
    },
    "allOf": buildEvents()
}
