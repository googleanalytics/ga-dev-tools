import "jest"
import { Validator } from "../../validator" 
import { eventDefinitions } from "./eventDefinitions"
import { getEventSchema } from "./eventBuilder"

describe("eventSchema for purchase", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {
            'transaction_id': 'A12345',
            'currency': 'USD',
            'value': 12,
            'items': [{
                'item_id': '1234'
            }]
        }

        let validator = new Validator(getEventSchema(eventDefinitions['purchase']))

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("can be used to validate a valid payload", () => {
        const validInput = {
            'transaction_id': 'A12345',
            'currency': 'USD',
            'value': 12.00,
            'items': [{
                'item_id': '1234'
            }]
        }

        let validator = new Validator(getEventSchema(eventDefinitions['purchase']))

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("can be used to validate required fields", () => {
        const invalidInput = {
            'items': [{
                'item_id': '1234'
            }]
        }

        let validator = new Validator(getEventSchema(eventDefinitions['purchase']))

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("can be used to validate dependent fields", () => {
        const invalidInput = {
            'transaction_id': 'A12345',
            'currency': 'USD',
            'items': [{
                'item_id': '1234'
            }]
        }

        let validator = new Validator(getEventSchema(eventDefinitions['purchase']))

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("can be used to validate dependent fields", () => {
        const invalidInput = {
            'transaction_id': 'A12345',
            'value': 12.10,
            'items': [{
                'item_id': '1234'
            }]
        }

        let validator = new Validator(getEventSchema(eventDefinitions['purchase']))

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("can be used to validate value type", () => {
        const invalidInput = {
            'transaction_id': 'A12345',
            'value': '12.10',
            'items': [{
                'item_id': '1234'
            }]
        }

        let validator = new Validator(getEventSchema(eventDefinitions['purchase']))

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    // #TODO: validate actual currency values -- find currency validator library
})