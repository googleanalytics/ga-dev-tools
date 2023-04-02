import { StorageKey } from "@/constants"
import { RequestStatus } from "@/types"
import { AccountSummary, PropertySummary } from "@/types/ga4/StreamPicker"
import moment from "moment"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import useAccountSummaries from "../StreamPicker/useAccounts"

const maxAge = moment.duration(30, "minutes")
type StreamsForProperty = {
  webStreams: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaWebDataStream[]
  iosStreams: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaIosAppDataStream[]
  androidStreams: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAndroidAppDataStream[]
  property: string
  timestamp: number
}

const fetchAllStreams = async (
  adminAPI: typeof gapi.client.analyticsadmin,
  property: string,
  key: string
) => {
  const [
    {
      result: { webDataStreams: webStreams = [] },
    },
    {
      result: { iosAppDataStreams: iosStreams = [] },
    },
    {
      result: { androidAppDataStreams: androidStreams = [] },
    },
  ] = await Promise.all([
    adminAPI.properties.webDataStreams.list({
      parent: property,
    }),
    adminAPI.properties.iosAppDataStreams.list({
      parent: property,
    }),
    adminAPI.properties.androidAppDataStreams.list({
      parent: property,
    }),
  ])
  // TODO - consider handling pagination, though it seems very unlikely there
  // will be _pages_ of streams for a given property.
  const fetchTime = moment.now()
  const nu: StreamsForProperty = {
    webStreams,
    iosStreams,
    androidStreams,
    property,
    timestamp: fetchTime,
  }

  window.localStorage.setItem(key, JSON.stringify(nu))

  return nu
}

interface PropertyWithStreams extends PropertySummary {
  webStreams?: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaWebDataStream[]
  androidStreams?: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAndroidAppDataStream[]
  iosStreams?: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaIosAppDataStream[]
}

export interface AccountWithStreams extends AccountSummary {
  propertySummaries: Array<PropertyWithStreams>
}

const useAllAPS = () => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const adminAPI = useMemo(() => gapi?.client?.analyticsadmin, [gapi])
  const accountSummariesRequest = useAccountSummaries()
  const accounts = useMemo(
    () =>
      accountSummariesRequest.status === RequestStatus.Successful
        ? accountSummariesRequest.accounts
        : undefined,
    [accountSummariesRequest]
  )
  const [allAPS, setAllAPS] = useState<AccountWithStreams[] | undefined>(
    accounts as AccountWithStreams[]
  )

  const shouldRun = useRef(true)

  useEffect(() => {
    shouldRun.current = true
    if (adminAPI === undefined || accounts === undefined) {
      return
    }
    if (accounts.length === 0) {
      return
    }
    ;(async () => {
      for (let accountIdx = 0; accountIdx < accounts.length; accountIdx++) {
        if (shouldRun.current) {
          const currentAccount = accounts[accountIdx]
          const currentProperties = currentAccount.propertySummaries
          if (
            currentProperties === undefined ||
            currentProperties.length === 0
          ) {
            return
          }
          for (
            let propertyIdx = 0;
            propertyIdx < currentProperties.length;
            propertyIdx++
          ) {
            if (shouldRun.current) {
              const currentProperty = currentProperties[propertyIdx]

              const key = StorageKey.ga4Streams + currentProperty.property!
              const fromCache = window.localStorage.getItem(key)
              let stuff: StreamsForProperty
              if (fromCache !== null) {
                const parsed: StreamsForProperty = JSON.parse(fromCache)
                const now = moment()
                const cacheTime = moment(parsed.timestamp)
                if (
                  cacheTime === undefined ||
                  now.isAfter(moment(cacheTime).add(maxAge))
                ) {
                  console.log("should update")
                  stuff = await fetchAllStreams(
                    adminAPI,
                    currentProperty.property!,
                    key
                  )
                } else {
                  stuff = parsed
                }
              } else {
                stuff = await fetchAllStreams(
                  adminAPI,
                  currentProperty.property!,
                  key
                )
              }
              const { webStreams, androidStreams, iosStreams } = stuff
              setAllAPS((old = []) => {
                return old.map((aws, aIdx) =>
                  aIdx === accountIdx
                    ? {
                        ...aws,
                        propertySummaries: (
                          aws.propertySummaries || []
                        ).map((pws, pIdx) =>
                          pIdx === propertyIdx
                            ? { ...pws, iosStreams, androidStreams, webStreams }
                            : pws
                        ),
                      }
                    : aws
                )
              })
            }
          }
        }
      }
    })()

    return () => {
      shouldRun.current = false
    }
  }, [accounts, adminAPI, setAllAPS])

  return allAPS
}

export default useAllAPS
