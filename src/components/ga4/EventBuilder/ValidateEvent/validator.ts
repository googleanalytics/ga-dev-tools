import { Draft07 } from "json-schema-library"

type schemaObject = {
    [key:string]: any;
}

// Create a class that instantiates the Draft07 JSON schema validation.
// Methods .isValid and .getErrors use Draft07 schema to validate provided
// payload and return errors based on payload schema

export class Validator {
    schema: schemaObject 
    validator: Draft07

    constructor(
        schema: schemaObject
    ) {
        this.schema = schema
        this.validator = new Draft07(schema)
      }
        
    public isValid = (payload: any) => {
        return this.validator.isValid(payload)
    }

    public getErrors = (payload: any) => {
        return this.validator.validate(payload)
    }
}