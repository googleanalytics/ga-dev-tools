import { useState, useMemo, useCallback, useEffect } from "react"

import {
  Dispatch,
  Requestable,
  RequestStatus,
  successful,
  inProgress,
} from "@/types"
import {
  AccountSummary,
  PropertySummary,
  SelectedStream,
  Stream,
} from "@/types/ga4/StreamPicker"
import useAccounts from "./useAccounts"
import useStreams from "./useStreams"

const useStreamPicker = (
  account: AccountSummary | undefined,
  property: PropertySummary | undefined
): {
  accountsAndProperties: Requestable<{
    accounts: AccountSummary[]
    properties: PropertySummary[]
  }>
} => {
  const accountSummariesRequest = useAccounts()
  const streamsRequest = useStreams(property)

  // const [streamsDone, setStreamsDone] = useState(
  //   successful(streamsRequest) !== undefined
  // )
  //
  // const setStreamOnceDone = useCallback(() => {
  //   setStreamsDone(false)
  // }, [])

  // const streams = useMemo(() => {
  //   const s = successful(streamsRequest)
  //   if (s) {
  //     const {
  //       web,
  //       // android, ios
  //     } = s
  //     return web.concat(android).concat(ios)
  //   }
  //   return undefined
  // }, [streamsRequest])

  const accounts = useMemo(
    () => successful(accountSummariesRequest)?.accounts,
    [accountSummariesRequest]
  )

  const properties = useMemo(() => {
    if (accounts === undefined) {
      return undefined
    }
    if (account === undefined) {
      return []
    }
    return accounts.find(a => a.name === account.name)?.propertySummaries || []
  }, [accounts, account])

  const accountsAndProperties = useMemo(() => {
    if (accountSummariesRequest.status === RequestStatus.Successful) {
      if (accounts === undefined || properties === undefined) {
        throw new Error(
          "Invalid invariant: accounts & properties must be defined here."
        )
      }
      return { status: accountSummariesRequest.status, accounts, properties }
    }
    return { status: accountSummariesRequest.status }
  }, [accountSummariesRequest, accounts, properties])

  return {
    accountsAndProperties,
  }

  // const setPropertySummary = useCallback(
  //   (property: PropertySummary | undefined) => {
  //     setSelectedStream(old => ({
  //       ...old,
  //       property,
  //       stream: undefined,
  //     }))
  //     setPropertyUI && setPropertyUI(property)
  //     setStreamOnceDone()
  //   },
  //   [setPropertyUI, setStreamOnceDone]
  // )

  // const setAccountSummary = useCallback(
  //   (account: AccountSummary | undefined) => {
  //     setSelectedStream(old => ({
  //       ...old,
  //       account,
  //     }))
  //     setAccountUI && setAccountUI(account)
  //     const properties = account?.propertySummaries
  //     if (properties !== undefined && properties.length > 0) {
  //       setPropertySummary(properties[0])
  //     }
  //   },
  //   [setAccountUI, setPropertySummary]
  // )

  // useEffect(() => {
  //   const streams = successful(streamsRequest)
  //   if (streamsDone || streams === undefined) {
  //     return
  //   }
  //   if (property !== undefined) {
  //     let stream: Stream | undefined = undefined
  //     if (streams.streams.length > 0) {
  //       stream = streams.streams[0]
  //     }
  //     setSelectedStream(old => ({
  //       ...old,
  //       stream,
  //     }))
  //     setStreamsDone(true)
  //   }
  // }, [streamsDone, property, streamsRequest])

  // const setStream = useCallback(
  //   (stream: Stream | undefined) => {
  //     setSelectedStream(old => ({ ...old, stream }))
  //     setStreamUI && setStreamUI(stream)
  //   },
  //   [setStreamUI]
  // )

  // useEffect(() => {
  //   if (inProgress(accountSummariesRequest)) {
  //     setStatus(RequestStatus.InProgress)
  //   }
  //   if (successful(accountSummariesRequest)) {
  //     setStatus(RequestStatus.Successful)
  //   }
  // }, [accountSummariesRequest])

  // switch (status) {
  //   case RequestStatus.Failed:
  //     return { status: RequestStatus.Failed }
  //   case RequestStatus.InProgress:
  //     return { status: RequestStatus.InProgress }
  //   case RequestStatus.NotStarted:
  //     return { status: RequestStatus.NotStarted }
  //   case RequestStatus.Successful: {
  //     return {
  //       status: RequestStatus.Successful,
  //       account,
  //       property,
  //       stream,
  //       propertySummaries,
  //       streams,
  //       setAccountSummary,
  //       setPropertySummary,
  //       setStream,
  //       accountSummaries: accountSummaries || [],
  //     }
  //   }
  // }
}

export default useStreamPicker
