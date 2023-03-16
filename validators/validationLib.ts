import { validationServerAdaptor } from "./validationServerAdaptor"
import validateHit from "../src/components/ga4/EventBuilder/ValidateEvent/useValidateEvent"
import {
    Payload,
    SchemaType,
    AdditionalParams,
    ContentLength,
} from "./types"

export class validationLib  {
    payload: Payload
    additionalParams: AdditionalParams
    schemaType: SchemaType
    contentLength: ContentLength

    constructor(
        payload: Payload, 
        additionalParams: AdditionalParams,
        schemaType: SchemaType,
        contentLength: ContentLength,
    ) {
        this.payload = payload
        this.additionalParams = additionalParams
        this.schemaType = schemaType
        this.contentLength = contentLength
    }

    public validate(): boolean {
        // error message from API
        const serverAdaptor = new validationServerAdaptor(
            this.payload,
            this.schemaType
        )
        const response = serverAdaptor.smartValidate()
        // Validate(this.payload)

        // error messages from JSON schema validator
        // let baseValidator = validator.EventValidator(schema=baseContent.schema)
        // let eventValidator = validator.EventValidator(schema=eventContent.schema)
        // let targetValidator = this.schemaType === "event" ? eventValidator : baseValidator
        
        return true
    }
}

// function Validate(payload) {
//     console.log('here')
//     validateHit(
//         payload,
//         "1: xxxxxxxxxxxx: xxx: xxxxxxxxxxxxxxxxxxxxxx",
//         "mock_api_secret",
//     )
// }