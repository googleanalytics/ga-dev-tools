// Base JSON Body Content Schema.

import { userPropertiesSchema } from './userProperties'
import { eventsSchema } from './events'

// export const baseContentSchema = {
//     "type": "object",
//     "required": ["app_instance_id", "events"],
//     "additionalProperties": false,
//     "properties": {
//         "app_instance_id": {
//             "type": "string",
//             "format": "app_instance_id"
//         },
//         "client_id": {
//             "type": "string",
//         },
//         "user_id": {
//             "type": "string"
//         },
//         "timestamp_micros": {
//             // "type": "number"
//         },
//         "user_properties": userPropertiesSchema,
//         "non_personalized_ads": {
//             "type": "boolean"
//         },
//         "events": eventsSchema,
//     }
// }

export const baseContentSchema = {
    "type": "object",
    "oneOf": [
        {
            "required": ["app_instance_id", "events"],
            "additionalProperties": false,
            "properties": {
                "app_instance_id": {
                    "type": "string",
                    "format": "app_instance_id"
                },
                "client_id": {
                    "type": "string",
                },
                "user_id": {
                    "type": "string"
                },
                "timestamp_micros": {
                    // "type": "number"
                },
                "user_properties": userPropertiesSchema,
                "non_personalized_ads": {
                    "type": "boolean"
                },
                "events": eventsSchema,
            }
        },
        {
            "required": ["client_id", "events"],
            "additionalProperties": false,
            "properties": {
                "app_instance_id": {
                    "type": "string",
                    "format": "app_instance_id"
                },
                "client_id": {
                    "type": "string",
                },
                "user_id": {
                    "type": "string"
                },
                "timestamp_micros": {
                    // "type": "number"
                },
                "user_properties": userPropertiesSchema,
                "non_personalized_ads": {
                    "type": "boolean"
                },
                "events": eventsSchema,
            }
        },
    ],
}