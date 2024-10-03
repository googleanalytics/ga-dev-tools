// """Event Builder Module."""

// from google3.corp.gtech.ads.infrastructure.mapps_s2s_event_validator.schemas.event_types import custom
import { eventDefinitions } from "./eventTypes/eventDefinitions"
import { VALUE_CURRENCY_DEPENDENCY } from "./eventTypes/fieldDefinitions"
import { getAllEventProperties } from "./eventTypes/eventBuilder"
import { customSchema } from "./eventTypes/custom"

type conditionalObject = {
    [key:string]: any;
}

// Build condition list of event to schema mapping.
export const buildEvents = () => {
    const allEventTypes: conditionalObject[] = []
//  Add all recommended event schemas
    for (const eventName in eventDefinitions) {
        const cond = {
            "if": {
                "properties": {
                    "name": {
                        "const": eventName
                    }
                }
            },
            "then": {
                "properties": {
                    "params": {
                        "type": "object",
                        "required":
                            // @ts-ignore
                            eventDefinitions[eventName],
                        "properties": getAllEventProperties(),
                        "dependencies": VALUE_CURRENCY_DEPENDENCY,
                        "propertyNames": {
                            "pattern":
                                "^(?!ga_|google_|firebase_)[A-Za-z][A-Za-z0-9_]*$",
                            "maxLength":
                                40
                        },
                        "patternProperties": {
                            ".": {
                                "maxLength": 100
                            }
                        }
                    }
                }
            }
        }

        allEventTypes.push(cond)
    }

    const knownEventList = "|" + Object.keys(eventDefinitions)
    const nameNotMatchPattern = "^(?!(" + knownEventList + ")$).*$"
    const customCond = {
        "if": {
            "properties": {
                "name": {
                    "pattern": nameNotMatchPattern
                }
            }
        },
        "then": {
            "properties": {
                "params": customSchema,
            }
        }
    }
    allEventTypes.push(customCond)

    return allEventTypes
}