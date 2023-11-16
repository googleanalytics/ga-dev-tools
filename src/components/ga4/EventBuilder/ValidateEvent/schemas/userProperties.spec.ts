import "jest"
import { Validator } from "../validator"
import { userPropertiesSchema } from "./userProperties" 

describe("userPropertiesSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {'custom_user_id': {'value': '123456'}}

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("is invalid for events with more than 25 items", () => {
        let invalidInput = {}
        for (let i=0; i<= 25; i++) {
            // @ts-ignore
            invalidInput['property_' + i] = {'value': '123456'}
        }

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is invalid for values with over 36 chars", () => {
        const invalidInput = {'custom_user_id': {'value': '1234567890123456789012345678901234567'}}

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is invalid when additional properties are added", () => {
        const invalidInput = {
            'custom_user_id': {
                'value': '1234',
                'addtlprop': '1234'
            }
        }

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is invalid when value prop is not included", () => {
        const invalidInput = {
            'custom_user_id': {
                'valuee': '1234'
            }
        }

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is invalid when property name is over 24 chars long", () => {
        const invalidInput = {
            'propproppropproppropprop1': {
                'value': '1234'
            }
        }

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is invalid when property name has invalid characters", () => {
        const invalidInput = {
            'prop!': {
                'value': '1234'
            }
        }

        let validator = new Validator(userPropertiesSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })
})