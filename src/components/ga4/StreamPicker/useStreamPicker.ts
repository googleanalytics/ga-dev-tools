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
import useAccountSummaries from "./useAccountSummaries"
import useStreams from "./useStreams"

interface Successful {
  accountSummaries: AccountSummary[]
  propertySummaries: PropertySummary[]
  account: AccountSummary | undefined
  property: PropertySummary | undefined
  stream: Stream | undefined
  streams?: Stream[]
  setAccountSummary: (a: AccountSummary | undefined) => void
  setPropertySummary: (p: PropertySummary | undefined) => void
  setStream: (s: Stream | undefined) => void
}

interface Arg {
  account?: AccountSummary
  property?: PropertySummary
  stream?: Stream

  setAccount?: Dispatch<AccountSummary | undefined>
  setProperty?: Dispatch<PropertySummary | undefined>
  setStream?: Dispatch<Stream | undefined>
}

const useStreamPicker = ({
  account: initialAccount,
  property: initialProperty,
  stream: initialStream,

  setAccount: setAccountUI,
  setProperty: setPropertyUI,
  setStream: setStreamUI,
}: Arg): Requestable<Successful> => {
  const [status, setStatus] = useState(RequestStatus.NotStarted)
  const [selectedStream, setSelectedStream] = useState<SelectedStream>({
    account: initialAccount,
    property: initialProperty,
    stream: initialStream,
  })

  const account = useMemo(() => selectedStream.account, [selectedStream])
  const property = useMemo(() => selectedStream.property, [selectedStream])
  const stream = useMemo(() => selectedStream.stream, [selectedStream])

  const accountSummariesRequest = useAccountSummaries()
  const streamsRequest = useStreams(selectedStream?.property?.property)
  const [streamsDone, setStreamsDone] = useState(
    successful(streamsRequest) !== undefined
  )

  const streams = useMemo(() => {
    const s = successful(streamsRequest)
    if (s) {
      const { web, android, ios } = s
      return web.concat(android).concat(ios)
    }
    return undefined
  }, [streamsRequest])

  const accountSummaries = useMemo(
    () => successful(accountSummariesRequest)?.accountSummaries,
    [accountSummariesRequest]
  )

  const propertySummaries = useMemo(() => {
    const s = successful(accountSummariesRequest)
    if (s) {
      const { accountSummaries } = s
      if (selectedStream.account === undefined) {
        return accountSummaries.flatMap(
          summary => summary.propertySummaries || []
        )
      } else {
        const summary = accountSummaries.find(
          account => account.name === selectedStream.account?.name
        )
        return summary?.propertySummaries || []
      }
    }
    return []
  }, [accountSummariesRequest, selectedStream])

  const setStreamOnceDone = useCallback(() => {
    setStreamsDone(false)
  }, [])

  const setPropertySummary = useCallback(
    (property: PropertySummary | undefined) => {
      setSelectedStream(old => ({
        ...old,
        property,
        stream: undefined,
      }))
      setPropertyUI && setPropertyUI(property)
      setStreamOnceDone()
    },
    [setPropertyUI, setStreamOnceDone]
  )

  const setAccountSummary = useCallback(
    (account: AccountSummary | undefined) => {
      setSelectedStream(old => ({
        ...old,
        account,
      }))
      setAccountUI && setAccountUI(account)
      const properties = account?.propertySummaries
      if (properties !== undefined && properties.length > 0) {
        setPropertySummary(properties[0])
      }
    },
    [setAccountUI, setPropertySummary]
  )

  useEffect(() => {
    const streams = successful(streamsRequest)
    if (streamsDone || streams === undefined) {
      return
    }
    if (property !== undefined) {
      let stream: Stream | undefined = undefined
      if (streams.streams.length > 0) {
        stream = streams.streams[0]
      }
      setSelectedStream(old => ({
        ...old,
        stream,
      }))
      setStreamsDone(true)
    }
  }, [streamsDone, property, streamsRequest])

  const setStream = useCallback(
    (stream: Stream | undefined) => {
      setSelectedStream(old => ({ ...old, stream }))
      setStreamUI && setStreamUI(stream)
    },
    [setStreamUI]
  )

  useEffect(() => {
    if (inProgress(accountSummariesRequest)) {
      setStatus(RequestStatus.InProgress)
    }
    if (successful(accountSummariesRequest)) {
      setStatus(RequestStatus.Successful)
    }
  }, [accountSummariesRequest])

  switch (status) {
    case RequestStatus.Failed:
      return { status: RequestStatus.Failed }
    case RequestStatus.InProgress:
      return { status: RequestStatus.InProgress }
    case RequestStatus.NotStarted:
      return { status: RequestStatus.NotStarted }
    case RequestStatus.Successful: {
      return {
        status: RequestStatus.Successful,
        account,
        property,
        stream,
        propertySummaries,
        streams,
        setAccountSummary,
        setPropertySummary,
        setStream,
        accountSummaries: accountSummaries || [],
      }
    }
  }
}

export default useStreamPicker
