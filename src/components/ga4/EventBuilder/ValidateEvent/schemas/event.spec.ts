import "jest"
import { Validator } from "../validator"
import { eventSchema } from "./event"

describe("eventSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {'name': 'someevent', 'params': {}}

        let validator = new Validator(eventSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })
})