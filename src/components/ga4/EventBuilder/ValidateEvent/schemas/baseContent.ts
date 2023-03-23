// Base JSON Body Content Schema.

// from google3.corp.gtech.ads.infrastructure.mapps_s2s_event_validator.schemas import events
import { userPropertiesSchema } from './userProperties'
import { eventsSchema } from './events'

export const baseContentSchema = {
    "type": "object",
    "required": ["app_instance_id", "events"],
    "additionalProperties": false,
    "properties": {
        "app_instance_id": {
            "type": "string",
            "format": "app_instance_id"
        },
        "user_id": {
            "type": "string"
        },
        "timestamp_micros": {
            "type": "number"
        },
        "user_properties": userPropertiesSchema,
        "non_personalized_ads": {
            "type": "boolean"
        },
        "events": eventsSchema,
    }
}
