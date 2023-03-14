import { Payload } from "./types"

export class ValidationError {
    message: string
    instance: Payload
    validator: string
    path: Array<string>

    constructor(
        message: string,
        instance: Payload,
        validator: string,
        path: Array<string>,
    ) {
        this.message = message
        this.instance = instance
        this.validator = validator
        this.path = path
    }
}