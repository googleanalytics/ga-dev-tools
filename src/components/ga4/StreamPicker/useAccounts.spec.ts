import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react-hooks"

import useAccounts from "./useAccounts"
import { act } from "react-test-renderer"
import { RequestStatus } from "@/types"
import { wrapperFor } from "@/test-utils"

describe("useAccounts", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe("when value not cached", () => {
    test("sucessfully makes requests", async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          return useAccounts()
        },
        { wrapper: wrapperFor() }
      )
      expect(result.current.status).toEqual(RequestStatus.InProgress)

      await act(async () => {
        await waitForNextUpdate()
      })

      expect(result.current.status).toEqual(RequestStatus.Successful)
    })
  })
})
