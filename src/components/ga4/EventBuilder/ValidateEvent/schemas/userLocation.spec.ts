import "jest"
import { Validator } from "../validator"
import { userLocationSchema } from "./userLocation"

describe("userLocationSchema", () => {
  test("can be used to validate a valid payload", () => {
    const validInput = {
      city: "Mountain View",
      region_id: "US-CA",
      country_id: "US",
      subcontinent_id: "021",
      continent_id: "019",
    }
    const validator = new Validator(userLocationSchema)
    expect(validator.isValid(validInput)).toEqual(true)
  })

  test.each([["US-CA"], ["US-C"], ["US-C1A"]])(
    "is valid with a valid region_id: %s",
    region_id => {
      const validator = new Validator(userLocationSchema)
      expect(validator.isValid({ region_id })).toEqual(true)
    }
  )

  test.each([["USA-CA"], ["US-CALI"], ["us-ca"], ["US_CA"]])(
    "is invalid with an invalid region_id: %s",
    region_id => {
      const validator = new Validator(userLocationSchema)
      expect(validator.isValid({ region_id })).toEqual(false)
    }
  )

  test("is valid with a valid country_id", () => {
    const validInput = { country_id: "US" }
    const validator = new Validator(userLocationSchema)
    expect(validator.isValid(validInput)).toEqual(true)
  })

  test.each([["USA"], ["U"], ["us"]])(
    "is invalid with an invalid country_id: %s",
    country_id => {
      const validator = new Validator(userLocationSchema)
      expect(validator.isValid({ country_id })).toEqual(false)
    }
  )

  test("is valid with a valid subcontinent_id", () => {
    const validInput = { subcontinent_id: "021" }
    const validator = new Validator(userLocationSchema)
    expect(validator.isValid(validInput)).toEqual(true)
  })

  test.each([["21"], ["0211"], ["abc"]])(
    "is invalid with an invalid subcontinent_id: %s",
    subcontinent_id => {
      const validator = new Validator(userLocationSchema)
      expect(validator.isValid({ subcontinent_id })).toEqual(false)
    }
  )

  test("is valid with a valid continent_id", () => {
    const validInput = { continent_id: "019" }
    const validator = new Validator(userLocationSchema)
    expect(validator.isValid(validInput)).toEqual(true)
  })

  test.each([["19"], ["0199"], ["abc"]])(
    "is invalid with an invalid continent_id: %s",
    continent_id => {
      const validator = new Validator(userLocationSchema)
      expect(validator.isValid({ continent_id })).toEqual(false)
    }
  )

  test("is invalid with additional properties", () => {
    const invalidInput = {
      city: "Mountain View",
      extra_prop: "should fail",
    }
    const validator = new Validator(userLocationSchema)
    expect(validator.isValid(invalidInput)).toEqual(false)
  })
})
