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
        const invalidInput = {}

        let validator = new Validator(itemSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("ensures property names are 40 characters or fewer", () => {
        const invalidInput = {'itemitemieitemitemieitemitemieitemitemie1': 'item_1234', 'item_id': '123'}

        let validator = new Validator(itemSchema)
        console.log(validator.getErrors(invalidInput))

        expect(validator.isValid(invalidInput)).toEqual(false)
    })

    test("ensures property values are 100 characters or fewer", () => {
        const invalidInput = {'item_id': 'item123456item123456item123456item123456item123456item123456item123456item123456item123456item1234567'}

        let validator = new Validator(itemSchema)

        expect(validator.isValid(invalidInput)).toEqual(false)
    })
})