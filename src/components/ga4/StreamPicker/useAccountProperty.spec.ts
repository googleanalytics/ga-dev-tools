import "@testing-library/jest-dom"
import { renderHook, act } from "@testing-library/react-hooks"

import useAccountProperty from "./useAccountProperty"
import { wrapperFor } from "@/test-utils"
import { StorageKey } from "@/constants"

enum QueryParam {
  Account = "a",
  Property = "b",
  Stream = "c",
}

describe("useAccountProperty hook", () => {
  test("with Account & Property values already saved in localStorage", async () => {
    const accountID = "account-id"
    window.localStorage.setItem(
      "a-account",
      JSON.stringify({ value: accountID })
    )
    const accountSummariesMock = jest.fn<
      Promise<{
        result: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAccountSummariesResponse
      }>,
      Parameters<typeof gapi.client.analyticsadmin.accountSummaries.list>
    >(() =>
      Promise.resolve({
        result: {
          accountSummaries: [
            {
              account: accountID,
              displayName: "My first account",
              propertySummaries: [
                { property: "property-id", displayName: "My first property" },
              ],
            },
          ],
        },
      })
    )
    const { result, waitForNextUpdate } = renderHook(
      () => useAccountProperty("a" as StorageKey, QueryParam),
      {
        wrapper: wrapperFor({
          gapi: {
            client: {
              analyticsadmin: {
                accountSummaries: { list: accountSummariesMock as any },
              },
            },
          },
        }),
      }
    )

    expect(result.current.account).toBeUndefined()
    expect(result.current.property).toBeUndefined()

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(result.current.account).not.toBeUndefined()
  })
  // test("defaults to selectContent", () => {
  //   const { result } = renderHook(() => useEvent(), options)
  //   expect(result.current.type).toBe(EventType.SelectContent)
  // })

  // describe("when changing event type", () => {
  //   // TODO - add this test back in once the keepCommonParameters fix is done.
  //   // test("keeps values of common parameters", async () => {
  //   //   const { result } = renderHook(
  //   //     () => useEvent(EventType.SelectContent),
  //   //     options
  //   //   )

  //   //   act(() => {
  //   //     const idx = result.current.parameters.findIndex(
  //   //       parameter => parameter.name === "content_type"
  //   //     )
  //   //     if (idx === -1) {
  //   //       fail("select content is expected to have a 'content_type' parameter.")
  //   //     }
  //   //     result.current.setParamValue(idx, "image")
  //   //     result.current.setType(EventType.Share)
  //   //   })

  //   //   expect(result.current.type).toBe(EventType.Share)
  //   //   const idx = result.current.parameters.findIndex(
  //   //     p => p.name === "content_type"
  //   //   )
  //   //   expect(idx).not.toBe(-1)
  //   //   expect(result.current.parameters[idx].value).toBe("image")
  //   // })
  //   test("supports every event type", () => {
  //     const { result } = renderHook(
  //       () => useEvent(EventType.SelectContent),
  //       options
  //     )

  //     act(() => {
  //       Object.values(EventType).forEach(eventType => {
  //         result.current.setType(eventType)
  //       })
  //     })
  //   })
  //   describe("with no parameters in common", () => {
  //     test("only keeps new parameters", () => {
  //       // SelectContent and EarnVirtualCurrency have no parameters in common.
  //       const { result } = renderHook(
  //         () => useEvent(EventType.SelectContent),
  //         options
  //       )

  //       act(() => {
  //         result.current.setType(EventType.EarnVirtualCurrency)
  //       })

  //       const expectedParams = cloneEvent(
  //         suggestedEventFor(EventType.EarnVirtualCurrency)
  //       ).parameters
  //       const actualParams = result.current.parameters

  //       expect(actualParams).toHaveLength(expectedParams.length)
  //       actualParams.forEach((actualP, idx) => {
  //         const expectedP = expectedParams[idx]
  //         expect(actualP.name).toBe(expectedP.name)
  //         expect(actualP.value).toBe(expectedP.value)
  //         expect(actualP.type).toBe(expectedP.type)
  //       })
  //     })
  //     test("double swap only keeps new parameters", () => {
  //       // SelectContent and EarnVirtualCurrency have no parameters in common.
  //       const { result } = renderHook(
  //         () => useEvent(EventType.SelectContent),
  //         options
  //       )

  //       act(() => {
  //         result.current.setType(EventType.EarnVirtualCurrency)
  //         result.current.setType(EventType.SelectContent)
  //       })

  //       const expectedParams = cloneEvent(
  //         suggestedEventFor(EventType.SelectContent)
  //       ).parameters
  //       const actualParams = result.current.parameters

  //       expect(actualParams).toHaveLength(expectedParams.length)
  //       actualParams.forEach((actualP, idx) => {
  //         const expectedP = expectedParams[idx]
  //         expect(actualP.name).toBe(expectedP.name)
  //         expect(actualP.value).toBe(expectedP.value)
  //         expect(actualP.type).toBe(expectedP.type)
  //       })
  //     })
  //   })
  // })
})
