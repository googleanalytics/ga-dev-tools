import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import { StorageKey } from "@/constants"
import { useCallback, useMemo } from "react"
import useCached from "./useCached"
import moment from "moment"
import { act } from "react-test-renderer"

describe("useCached", () => {
  // The specific storage key shouldn't matter.
  const key: StorageKey = "abc" as StorageKey
  const expirey = moment.duration(5, "minutes")

  beforeEach(() => {
    window.localStorage.clear()
  })

  describe("when value not in cache", () => {
    test("requests value exactly once", async () => {
      let madeRequest = false
      const { result, waitForNextUpdate } = renderHook(() => {
        const makeRequest = useCallback(async () => {
          if (madeRequest) {
            fail("This function should be called exactly once.")
          } else {
            madeRequest = true
            return "my value"
          }
        }, [])
        const requestReady = useMemo(() => true, [])
        return useCached(key, makeRequest, expirey, requestReady)
      })

      // First render the value should be undefined while it's making the async request.
      expect(result.current.value).toEqual(undefined)

      await act(async () => {
        await waitForNextUpdate()
      })

      expect(result.current.value).toEqual("my value")
    })
  })

  describe("when value in cache", () => {
    test("uses cache value before expirey", () => {
      const expectedValue = {
        hi: "there",
      }

      window.localStorage.setItem(
        key,
        JSON.stringify({ value: expectedValue, "@@_lastFetched": moment.now() })
      )

      const { result } = renderHook(() => {
        const makeRequest = useCallback(async () => {
          fail("should not be called if value is in localStorage")
        }, [])
        const requestReady = useMemo(() => true, [])
        return useCached(key, makeRequest, expirey, requestReady)
      })
      expect(result.current.value).toEqual(expectedValue)
    })

    test("re-requests value after expirey", async () => {
      const expectedValue = {
        hi: "there",
      }

      window.localStorage.setItem(
        key,
        JSON.stringify({
          value: "i am out of date",
          "@@_lastFetched": moment(moment.now())
            .subtract(expirey)
            .subtract(moment.duration(1, "second"))
            .unix(),
        })
      )

      const { result, waitForNextUpdate } = renderHook(() => {
        const makeRequest = useCallback(async () => {
          return expectedValue
        }, [])
        const requestReady = useMemo(() => true, [])
        return useCached(key, makeRequest, expirey, requestReady)
      })

      expect(result.current.value).toEqual(undefined)

      await act(async () => {
        await waitForNextUpdate()
      })

      expect(result.current.value).toEqual(expectedValue)
    })
  })
})
