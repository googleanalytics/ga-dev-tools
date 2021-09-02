import { Requestable, RequestStatus } from "@/types"
import { useCallback, useMemo } from "react"
import {
  AccountSummary,
  WebPropertySummary,
  UAAccountPropertyView,
} from "../ViewSelector/useAccountPropertyView"
import useAccountSummaries from "./useAccountSummaries"

interface Successful {
  flattenedViews: UAAccountPropertyView[]
}

const useFlattenedViews = (
  accountSummary?: AccountSummary,
  propertySummary?: WebPropertySummary,
  filter?: (fv: UAAccountPropertyView) => boolean
): Requestable<Successful> => {
  const accountSummariesRequest = useAccountSummaries()

  const filterFlattened = useCallback(
    (flattenedView: UAAccountPropertyView) => {
      if (filter && filter(flattenedView) === false) {
        return false
      }
      return accountSummary === undefined
        ? true
        : accountSummary.id === flattenedView.account?.id
        ? propertySummary === undefined
          ? true
          : propertySummary.id === flattenedView.property?.id
        : false
    },
    [accountSummary, propertySummary, filter]
  )

  return useMemo(() => {
    switch (accountSummariesRequest.status) {
      case RequestStatus.Successful: {
        const accountSummaries = accountSummariesRequest.accountSummaries

        const flattenedViews = accountSummaries
          .flatMap<UAAccountPropertyView>(summary => {
            const account = { ...summary }

            const properties = summary.webProperties || []
            if (properties.length === 0) {
              return { account }
            }
            return properties.flatMap(propertySummary => {
              const property = { ...propertySummary }

              const profiles = propertySummary.profiles || []
              if (profiles.length === 0) {
                return { account, property }
              }
              return profiles.map(profile => ({
                view: profile,
                property,
                account,
              }))
            })
          })
          .filter(filterFlattened)
        return { status: accountSummariesRequest.status, flattenedViews }
      }
      default:
        return { status: accountSummariesRequest.status }
    }
  }, [accountSummariesRequest, filterFlattened])
}

export default useFlattenedViews
