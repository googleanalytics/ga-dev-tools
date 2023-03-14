import { validationServerAdaptor } from "./validationServerAdaptor"
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
        const serverAdaptor = new validationServerAdaptor(
            this.payload,
            this.schemaType
        )
        serverAdaptor.smartValidate()
        console.log('validate inside class!')
        return true
    }

}