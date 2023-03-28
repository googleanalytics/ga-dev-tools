import "jest"
import { Validator } from "../validator"
import { eventsSchema } from "./events" 

describe("eventsSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = [{'name': 'someevent', 'params': {}}]

        let validator = new Validator(eventsSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("is invalid for events with more than 25 items", () => {
        const invalidInput: Array<{}> = []
        for (let i=0; i<= 25; i++) {
            invalidInput.push({ 'name': 'someevent', 'params': {} })
        }

        let validator = new Validator(eventsSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("is invalid if additional properties are included", () => {
        const invalidInput = [{'name': 'someevent', 'params': {}, 'additionalprop': 123}]

        let validator = new Validator(eventsSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })
})