import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import { StorageKey } from "@/constants"
import { useState } from "react"
import { act } from "react-test-renderer"
import { usePersistantObject } from "."

describe("usePersistantObject", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe("when value in cache", () => {
    test("and switch to another value in cache, return other value", async () => {
      const firstKey = "firstKey" as StorageKey
      const firstValue = {
        firstKey,
      }
      const secondKey = "secondKey" as StorageKey
      const secondValue = {
        secondKey,
      }

      window.localStorage.setItem(firstKey, JSON.stringify(firstValue))
      window.localStorage.setItem(secondKey, JSON.stringify(secondValue))

      const { result } = renderHook(
        () => {
          const [key, setKey] = useState(firstKey)
          const sut = usePersistantObject(key)
          return { sut, setKey }
        },
        { initialProps: { key: firstKey } }
      )

      expect(result.current.sut[0]).toEqual(firstValue)

      act(() => {
        result.current.setKey(secondKey)
      })

      expect(result.current.sut[0]).toEqual(secondValue)
    })
  })
})
