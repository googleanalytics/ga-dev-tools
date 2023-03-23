// Events Schema.

import { eventSchema } from "./event";

export const eventsSchema = {
    "type": "array", 
    "maxItems": 25, 
    "items": eventSchema, 
    "minItems": 1
}

