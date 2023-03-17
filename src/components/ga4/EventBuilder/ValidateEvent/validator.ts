import { Draft07 } from "json-schema-library"

// example:
// const jsonSchema = new Draft07(myJsonSchema);
// const errors: JSONError[] = jsonSchema.validate(myData);

type schemaObject = {
    [key:string]: any;
}

export class Validator {
    schema: schemaObject 
    validator: any

    constructor(
        schema: schemaObject
    ) {
        this.schema = schema
        this.validator = new Draft07(schema)
    }

    public isValid = (payload) => {
        return this.validator.isValid(payload)
    }
}