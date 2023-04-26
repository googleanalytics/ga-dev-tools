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

describe("useKeyedHydratedPersistantObject", () => {
  test("grabs value from localStorage for first render.", () => {
    const key = "a" as StorageKey
    const id = "my-id"
    const expectedValue = "abcdef"
    const paramName = "paramName"
    window.localStorage.setItem(key, JSON.stringify({ value: id }))
    const complexValue = { id: "my-id", value: expectedValue }
    const { result } = renderHook(
      () => {
        const getValue = useCallback((key: string | undefined) => {
          if (key === id) {
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
    expect(result.current[0]?.value).toEqual(expectedValue)
  })
})
