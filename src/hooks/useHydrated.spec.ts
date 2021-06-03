import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import { TestWrapper, wrapperFor } from "@/test-utils"
import { useHydratedPersistantString } from "./useHydrated"
import { StorageKey } from "@/constants"

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
