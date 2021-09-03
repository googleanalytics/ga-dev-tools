import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import { StorageKey } from "@/constants"
import { useCallback, useMemo, useState } from "react"
import useCached from "./useCached"
import moment from "moment"
import { act } from "react-test-renderer"
import { failed, inProgress, RequestStatus, successful } from "@/types"

describe("useCached", () => {
  // The specific storage key shouldn't matter.
  const key: StorageKey = "abc" as StorageKey
  const expirey = moment.duration(5, "minutes")

  beforeEach(() => {
    window.localStorage.clear()
  })

  describe("when request throws an error", () => {
    test("Doesn't re-try the request millions of times", async () => {
      const expectedMessage = "This error should be handled gracefully."
      let madeRequest = false
      const requestReady = true
      const makeRequest = async () => {
        if (madeRequest) {
          fail("This should only have been called once.")
        } else {
          madeRequest = true
          throw new Error(expectedMessage)
        }
      }
      const { result, waitForNextUpdate } = renderHook(() => {
        return useCached(key, makeRequest, expirey, requestReady)
      })

      // First render the status should be InProgress while it's making the
      // async request.
      expect(result.current.status).toEqual(RequestStatus.InProgress)

      await act(async () => {
        await waitForNextUpdate()
      })

      // Then, since the request faliled, it should be in a failure state
      // forever.
      const actual = failed(result.current)
      expect(actual).not.toBeUndefined()
      expect(actual!.error.message).toBe(expectedMessage)
    })
  })

  describe("when value not in cache", () => {
    test("requests value exactly once", async () => {
      const expected = "my value"
      let madeRequest = false
      const { result, waitForNextUpdate } = renderHook(() => {
        const makeRequest = useCallback(async () => {
          if (madeRequest) {
            fail("This function should be called exactly once.")
          } else {
            madeRequest = true
            return expected
          }
        }, [])
        const requestReady = useMemo(() => true, [])
        return useCached(key, makeRequest, expirey, requestReady)
      })

      // First render the status should be InProgress while it's making the
      // async request.
      expect(result.current.status).toEqual(RequestStatus.InProgress)

      await act(async () => {
        await waitForNextUpdate()
      })

      const actual = successful(result.current)

      // The second render the value should be defined.
      expect(actual).not.toBeUndefined()
      // and the value from the callback.
      expect(actual!.value).toBe(expected)
    })
  })

  describe("when value in cache", () => {
    test("returns cache value immedietly", () => {
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

      const actual = successful(result.current)

      expect(actual).not.toBeUndefined()
      expect(actual!.value).toEqual(expectedValue)
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

      expect(result.current.status).toEqual(RequestStatus.InProgress)

      await act(async () => {
        await waitForNextUpdate()
      })

      const actual = successful(result.current)

      expect(actual).not.toBeUndefined()
      expect(actual!.value).toEqual(expectedValue)
    })

    test("bustCache updatesValue", async () => {
      const firstValue = {
        hi: "there",
      }

      const secondValue = {
        alsoHi: "alsoThere",
      }

      window.localStorage.setItem(
        key,
        JSON.stringify({ value: firstValue, "@@_lastFetched": moment.now() })
      )

      const { result, waitForNextUpdate } = renderHook(() => {
        const makeRequest = useCallback(async () => {
          return new Promise(resolve =>
            setTimeout(() => resolve(secondValue), 500)
          )
        }, [])
        const requestReady = useMemo(() => true, [])
        return useCached(key, makeRequest, expirey, requestReady)
      })

      // Value should be ready right away since it's a valid cache value.
      expect(result.current.status).toEqual(RequestStatus.Successful)

      await act(async () => {
        successful(result.current)!.bustCache()
      })

      expect(result.current.status).toEqual(RequestStatus.InProgress)

      await act(async () => {
        await waitForNextUpdate()
      })

      const actual = successful(result.current)

      expect(actual).not.toBeUndefined()
      expect(actual!.value).toEqual(secondValue)
    })

    test("and switch to another value in cache, return other value", async () => {
      const firstKey = "firstKey" as StorageKey
      const firstValue = {
        hi: "there",
      }
      const secondKey = "secondKey" as StorageKey
      const secondValue = {
        alsoHi: "alsoThere",
      }

      window.localStorage.setItem(
        firstKey,
        JSON.stringify({
          value: firstValue,
          "@@_lastFetched": moment.now(),
          "@@_cacheKey": firstKey,
        })
      )

      window.localStorage.setItem(
        secondKey,
        JSON.stringify({
          value: secondValue,
          "@@_lastFetched": moment.now(),
          "@@_cacheKey": secondKey,
        })
      )

      const { result } = renderHook(() => {
        const [key, setKey] = useState(firstKey)
        const makeRequest = useCallback(async () => {
          return secondValue
        }, [])
        const requestReady = useMemo(() => true, [])
        const sut = useCached(key, makeRequest, expirey, requestReady)
        return { sut, setKey }
      })

      expect(successful(result.current.sut)).not.toBeUndefined()
      expect(successful(result.current.sut)!.value).toEqual(firstValue)

      act(() => {
        result.current.setKey(secondKey)
      })

      expect(successful(result.current.sut)).not.toBeUndefined()
      expect(successful(result.current.sut)!.value).toEqual(secondValue)
    })

    test("and switch to another value not in cache, re-runs request and sets to InProgress", async () => {
      const firstKey = "firstKey" as StorageKey
      const firstValue = {
        hi: "there",
      }
      const secondKey = "secondKey" as StorageKey
      const secondValue = {
        alsoHi: "alsoThere",
      }

      window.localStorage.setItem(
        firstKey,
        JSON.stringify({
          value: firstValue,
          "@@_lastFetched": moment.now(),
          "@@_cacheKey": firstKey,
        })
      )

      const { result, waitForNextUpdate } = renderHook(() => {
        const [key, setKey] = useState(firstKey)
        const makeRequest = useCallback(async () => {
          return secondValue
        }, [])
        const requestReady = useMemo(() => true, [])
        const sut = useCached(key, makeRequest, expirey, requestReady)
        return { sut, setKey }
      })

      expect(successful(result.current.sut)).not.toBeUndefined()
      expect(successful(result.current.sut)!.value).toEqual(firstValue)

      act(() => {
        result.current.setKey(secondKey)
      })

      expect(inProgress(result.current.sut)).not.toBeUndefined()

      await act(async () => {
        await waitForNextUpdate()
      })

      expect(successful(result.current.sut)).not.toBeUndefined()
      expect(successful(result.current.sut)!.value).toEqual(secondValue)
    })
  })
})
