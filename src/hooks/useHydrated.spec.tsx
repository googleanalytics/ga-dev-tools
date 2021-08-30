import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import { TestWrapper, wrapperFor } from "@/test-utils"
import {
  useHydratedPersistantString,
  useKeyedHydratedPersistantObject,
} from "./useHydrated"
import { StorageKey } from "@/constants"
import { useCallback } from "react"

describe("useHydratedPersistantString", () => {
  // The specific storage key shouldn't matter.
  const key: StorageKey = "abc" as StorageKey

  let options = { wrapper: TestWrapper }
  beforeEach(() => {
    options = { wrapper: wrapperFor({}) }
  })

  test("first value is defaultValue", () => {
    const expected = "abcdef"
    const { result } = renderHook(
      () =>
        // The specific storage key shouldn't matter.
        useHydratedPersistantString(key, "paramName", expected),
      options
    )
    expect(result.current[0]).toBe(expected)
  })

  test("first value is from localStorage when set", () => {
    const expected = "localStorageValue"

    const { result } = renderHook(
      () => useHydratedPersistantString(key, "paramName", "defaultValue"),
      {
        wrapper: wrapperFor({
          setUp: () =>
            window.localStorage.setItem(
              key,
              JSON.stringify({ value: expected })
            ),
        }),
      }
    )

    expect(result.current[0]).toBe(expected)
  })
})

describe("use", () => {
  test("", () => {
    const key = "a" as StorageKey
    const paramName = "paramName"
    const complexValue = { id: "a", value: "aaa" }
    // TODO - put the key in localStorage so this actually has something to
    // grab for the first render.
    const { result } = renderHook(
      () => {
        const getValue = useCallback((key: string | undefined) => {
          if (key === "a") {
            return complexValue
          } else {
            return undefined
          }
        }, [])
        return useKeyedHydratedPersistantObject<typeof complexValue>(
          key,
          paramName,
          getValue
        )
      },
      {
        wrapper: wrapperFor({}),
      }
    )
    console.log("current", result.current)
    console.log("error", result.error)
    expect(result.current[0]?.value).toEqual("hi")
  })
})
