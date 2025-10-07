import "jest"
import { Validator } from "../../validator" 
import { customSchema } from "./custom" 

describe("customSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {'custom_prop1': 'somevalue'}

        let validator = new Validator(customSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("can be used to validate a valid payload with valid currency", () => {
        const validInput = {'value': 9.99, 'currency': 'USD'}

        let validator = new Validator(customSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("ensures the currency values are numbers", () => {
        const validInput = {'value': 'hello', 'currency': 'USD'}

        let validator = new Validator(customSchema)

        expect(validator.isValid(validInput)).toEqual(false)

    })

    test("ensures properties use valid naming conventions", () => {
        const validInput = {'_method': true}

        let validator = new Validator(customSchema)

        expect(validator.isValid(validInput)).toEqual(false)
    })

    test("ensures properties dependency", () => {
        const validInput = {'value': 99}

        let validator = new Validator(customSchema)

        expect(validator.isValid(validInput)).toEqual(false)
    })
})