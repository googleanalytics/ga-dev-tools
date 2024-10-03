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

    test("is not valid with an additional property", () => {
        const invalidInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [{
                'name': 'something',
                'params': {}
            }],
            'additionalProperty': 123
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("validates specific event names", () => {
        const validInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [{
                'name': 'purchase',
                'params': {
                    'transaction_id': '894982',
                    'value': 89489,
                    'currency': 'USD',
                    'items': [
                        {
                            'item_name': 'test'
                        }
                    ]
                }
            }],
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("validates params don't have reserved suffixes", () => {
        const validInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [{
                'name': 'purchase',
                'params': {
                    'transaction_id': '894982',
                    'value': 89489,
                    'currency': 'USD',
                    'ga_test': '123',
                    'items': [
                        {
                            'item_name': 'test'
                        }
                    ]
                }
            }],
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(validInput)).toEqual(false)
    })

    test("validates required keys are present for certain events", () => {
        const validInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [{
                'name': 'purchase',
                'params': {
                    'transaction_id': '894982',
                    'currency': 'USD',
                    'items': [
                        {
                            'item_name': 'test'
                        }
                    ]
                }
            }],
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(validInput)).toEqual(false)
    })

    test("does NOT validate empty item aray for named events, because the error message is too complex and this is validated in formatCheckErrors", () => {
        const validInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [{
                'name': 'purchase',
                'params': {
                    'transaction_id': '894982',
                    'value': 89489,
                    'currency': 'USD',
                    'items': [{}]
                }
            }],
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("validates that items don't have reserved name keys", () => {
        const validInput = {
            'app_instance_id': 'bc17b822c8c84a7e84ac7e010cc2f740',
            'events': [{
                'name': 'purchase',
                'params': {
                    'transaction_id': '894982',
                    'value': 89489,
                    'currency': 'USD',
                    'items': [
                        {
                            'ga_test': 'et'
                        }
                    ]
                }
            }],
        }

        let validator = new Validator(baseContentSchema)

        expect(validator.isValid(validInput)).toEqual(false)
    })
})