import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import { StorageKey } from "@/constants"
import { useCallback, useMemo } from "react"
import useCached from "./useCached"
import moment from "moment"
import { act } from "react-test-renderer"
import { usePersistantObject } from "."
import { RequestStatus, successful } from "@/types"

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

      const { result, rerender } = renderHook(
        ({ key }: { key: StorageKey }) => {
          return usePersistantObject(key)
        },
        { initialProps: { key: firstKey } }
      )

      expect(result.current[0]).toEqual(firstValue)

      act(() => {
        rerender({ key: secondKey })
      })

      expect(result.current[0]).toEqual(secondValue)
    })
  })
})
