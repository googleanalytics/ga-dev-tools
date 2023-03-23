import "jest"
import { Validator } from "../validator"
import { eventsSchema } from "./events" 

describe("eventsSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = [{'name': 'someevent', 'params': {}}]

        let validator = new Validator(eventsSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })
})