import "jest"
import { Validator } from "../../validator" 
import { itemSchema } from "./item" 

describe("itemSchema", () => {
    test("can be used to validate a valid payload", () => {
        const validInput = {'item_id': 'item_1234'}

        let validator = new Validator(itemSchema)

        expect(validator.isValid(validInput)).toEqual(true)

    })

    test("can be used to validate a valid payload", () => {
        const validInput = {'item_name': 'item_1234'}

        let validator = new Validator(itemSchema)

        expect(validator.isValid(validInput)).toEqual(true)
    })

    test("can be used to ensure required properties are included", () => {
        const validInput = {}

        let validator = new Validator(itemSchema)

        expect(validator.isValid(validInput)).toEqual(false)
    })
})