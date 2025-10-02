import "jest"
import { Validator } from "../validator"
import { buildEvents } from "./schemaBuilder"

describe("schemaBuilder", () => {
  const schema = {
    allOf: buildEvents(),
  }

  const longString = "a".repeat(101)

  it("allows session_id to exceed 100 characters for recommended events", () => {
    const validator = new Validator(schema)
    const event = {
      name: "login",
      params: {
        session_id: longString,
      },
    }
    expect(validator.isValid(event)).toBe(true)
  })

  it("allows session_number to exceed 100 characters for recommended events", () => {
    const validator = new Validator(schema)
    const event = {
      name: "login",
      params: {
        session_number: longString,
      },
    }
    expect(validator.isValid(event)).toBe(true)
  })

  it("does not allow other properties to exceed 100 characters for recommended events", () => {
    const validator = new Validator(schema)
    const event = {
      name: "login",
      params: {
        method: longString,
      },
    }
    expect(validator.isValid(event)).toBe(false)
  })

  it("validates a correct payload", () => {
    const validator = new Validator(schema)
    const event = {
      name: "login",
      params: {
        method: "google",
      },
    }
    expect(validator.isValid(event)).toBe(true)
  })
})
