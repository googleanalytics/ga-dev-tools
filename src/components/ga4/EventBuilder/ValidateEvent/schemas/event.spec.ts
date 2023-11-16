import "jest"
import { Validator } from "../validator"
import { eventSchema } from "./event"

const appendProperties = (obj: any, num: number) => {
    for (let i=0; i < num; i++) {
        let key = 'property_' + i.toString()
        obj[key] = true
    }

    return obj
}

describe("eventSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {'name': 'someevent', 'params': {}}

        let validator = new Validator(eventSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("returns a 'RequiredPropertyError' when payload does not include a required property", () => {
        const inValidPayload = {}

        let validator = new Validator(eventSchema)
        let error = validator.getErrors(inValidPayload)[0].name

        expect(validator.isValid(inValidPayload)).toEqual(false)
        expect(error).toEqual('RequiredPropertyError')
    })

    test("returns a 'MaxProperties' error when payload properties exceed the max properties allowed", () => {
        let payload = {'name': 'someevent'}
        const inValidPayload = appendProperties(payload, 25)

        let validator = new Validator(eventSchema)
        let errors = validator.getErrors(inValidPayload)
        let errorNames = errors.map((error) => error.name)

        expect(errorNames).toContain('MaxPropertiesError')
        expect(errorNames).toContain('NoAdditionalPropertiesError')
        expect(errorNames).toContain('RequiredPropertyError')
    })
})