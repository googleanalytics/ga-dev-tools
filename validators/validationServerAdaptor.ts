import {
    Payload,
    SchemaType,
    ValidationMessage,
    SchemaValidationError
} from "./types"
import { ValidationError } from "./ValidationError"

const APP_INSTANCE_ID_CONST = "AABBCCDDEEFF11223344556677889900"
const VALIDATION_SERVER_URL = "https://www.google-analytics.com/debug/mp/collect?firebase_app_id=1:XXXXXXXXXXXX:xxx:xxxxxxxxxxxxxxxxxxxxxx&api_secret=mock_api_secret"

export class validationServerAdaptor  {
    payload: Payload
    schemaType: SchemaType

    constructor(
        payload: Payload, 
        schemaType: SchemaType,
    ) {
        this.payload = payload
        this.schemaType = schemaType
    }

    public smartValidate(): Array<SchemaValidationError> {
        let mutablePayload = JSON.parse(JSON.stringify(this.payload))

        if (this.schemaType == "event") {
            mutablePayload = {
                "app_instnace_id": APP_INSTANCE_ID_CONST,
                "events": [...mutablePayload]
            }
        }
        
        let runValidations = true;
        let totalErrors = [];
        const maxLoops = 5;

        for (let loopIndex = 0; loopIndex < maxLoops; loopIndex++) {
            console.log('IN LOOP');
            const errors = this.callValidationServer(mutablePayload);

            if (errors.length) {
                let error = errors[0];
                totalErrors.push(error);
                let fixedPayload = this.smartFixError(
                    JSON.parse(JSON.stringify(mutablePayload)), 
                    error
                )

                if (fixedPayload === mutablePayload) {
                    runValidations = false;
                } else {
                    mutablePayload = fixedPayload;
                }
            } else {
                runValidations = false;
            }
        }

        return totalErrors.map((message) => {
            return this.getErrorMessage(this.payload, message)
        })
    }

    private callValidationServer(payload: Payload): Array<ValidationMessage>|[] {
        payload["validationBehavior"] = "ENFORCE_RECOMMENDATIONS"
        let validationMessages: [] = []

        fetch(VALIDATION_SERVER_URL, {
          body: JSON.stringify(payload),
          method: "POST",
        })
        .then(response => response.json())
        .then((responseMessages) => {
          let validationMessages = responseMessages["validationMessages"] || []
        })
        .catch(error => {
          if (error instanceof Error && error.name === "ConnectionError") {
            return [];
          } else {
            throw error;
          }
        })

        return validationMessages
    }

    private smartFixError(payload: Payload, error: ValidationMessage): Payload {
        const validationCode = error["validationCode"]
        const fieldPath = error["fieldPath"]

        if (validationCode === 'VALUE_REQUIRED' && fieldPath === 'app_instance_id') {
            payload['app_instance_id'] = APP_INSTANCE_ID_CONST
        } else if (validationCode === 'VALUE_OUT_OF_BOUNDS') {
          return payload;
        } else if (validationCode === 'VALUE_INVALID' && fieldPath === 'timestamp_micros') {
          delete payload["timestamp_micros"];
        } else if (validationCode === "VALUE_TOO_LONG") {
            return payload;
        }
        // Name related codes.
        if (validationCode == "NAME_INVALID") {
          return payload
        } else if (validationCode === "NAME_DUPLICATED") {
            return payload
        } else if (validationCode === "NAME_RESERVED") {
          return payload
        } else if (validationCode === "NAME_TOO_LONG") {
          return payload
        }
      
        // Limit exceeded codes.
        if (validationCode === "EXCEEDED_MAX_ENTIES") {
          return payload
        }

        return payload;
    }

    private getErrorMessage(payload: Payload, errorObject:ValidationMessage): SchemaValidationError {
        return new ValidationError(
            errorObject["description"],
            payload,
            errorObject["validationCode"],
            errorObject["fieldPath"].split(","),
        )
    }
}