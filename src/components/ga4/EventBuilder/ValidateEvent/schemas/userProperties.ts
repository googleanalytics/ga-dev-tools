// User Properties Schema.

export const userPropertiesSchema = {
    "type": "object",
    "maxProperties": 25,
    "patternProperties": {
        ".": {
            "type": "object",
            "required": ["value"],
            "additionalProperties": false,

            "properties": {
                "value": {
                    "maxLength": 36
                },
                "timestamp_micros": {
                    "type": "number",
                    "maxLength": 36
                }
            }
        }
    },
    "propertyNames": {
        "format": "user_property_name",
        "pattern": "^(?!ga_|google_|firebase_)[A-Za-z][A-Za-z0-9_]*$",
        "maxLength": 24
    },
}