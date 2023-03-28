import "jest"
import { Validator } from "../validator"
import { baseContentSchema } from "./baseContent" 

describe("baseContentSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f74e',
            'events': [{
                'name': 'something',
                'params': {}
            }]
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("is not valid when an app_instance_id has dashes", () => {
        const invalidInput = {
            'app_instance_id': '0239500a-23af-4ab0-a79c-58c4042ea175',
            'events': []
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is not valid when an app_instance_id is not 32 chars", () => {
        const invalidInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f74',
            'events': []
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is not valid with an additional property", () => {
        const invalidInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [],
            'additionalProperty': 123
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is not valid without app_instance_id", () => {
        const invalidInput = {'events': []}

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })
})