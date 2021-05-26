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
  Stream,
} from "@/types/ga4/StreamPicker"
import useAccountSummaries from "./useAccountSummaries"

interface Successful {
  accountSummaries: AccountSummary[]
  propertySummaries: PropertySummary[]
  setAccountSummary: (a: AccountSummary | undefined) => void
  setPropertySummary: (p: PropertySummary | undefined) => void
}

interface Arg {
  account?: AccountSummary
  property?: PropertySummary

  setAccount?: Dispatch<AccountSummary | undefined>
  setProperty?: Dispatch<PropertySummary | undefined>
  setStream?: Dispatch<Stream | undefined>
}

const usePropertyPicker = ({
  account,
  setAccount,
  setProperty,
}: Arg): Requestable<Successful> => {
  const [status, setStatus] = useState(RequestStatus.NotStarted)

  const accountSummariesRequest = useAccountSummaries()

  const accountSummaries = useMemo(
    () => successful(accountSummariesRequest)?.accountSummaries,
    [accountSummariesRequest]
  )

  const propertySummaries = useMemo(() => {
    return account?.propertySummaries || []
  }, [account])

  const setPropertySummary = useCallback(
    (property: PropertySummary | undefined) => {
      setProperty && setProperty(property)
    },
    [setProperty]
  )

  const setAccountSummary = useCallback(
    (account: AccountSummary | undefined) => {
      setAccount && setAccount(account)
      setPropertySummary(account?.propertySummaries?.[0])
    },
    [setAccount, setPropertySummary]
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
        propertySummaries,
        setAccountSummary,
        setPropertySummary,
        accountSummaries: accountSummaries || [],
      }
    }
  }
}

export default usePropertyPicker
