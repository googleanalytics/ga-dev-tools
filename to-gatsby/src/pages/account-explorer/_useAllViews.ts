import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

type AccountSummary = gapi.client.analytics.AccountSummary

type Account = Omit<AccountSummary, "webProperties">
type Property = Omit<gapi.client.analytics.WebPropertySummary, "profiles">
type View = gapi.client.analytics.ProfileSummary

export interface FlattenedView {
  account: Account
  property: Property
  view: View
}

const useAllViews = () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const user = useSelector((state: AppState) => state.user)

  const [flattenedViews, setFlattenedViews] = useState<FlattenedView[]>([])

  useEffect(() => {
    if (user === undefined) {
      return
    }
    if (gapi !== undefined) {
      ;(async () => {
        const apiResponse = await gapi.client.analytics.management.accountSummaries.list(
          {}
        )
        const summaries: AccountSummary[] = apiResponse.result.items || []
        const flattenedViews: FlattenedView[] = summaries.flatMap(summary => {
          const account = { ...summary }
          delete account.webProperties

          const properties = summary.webProperties || []
          return properties.flatMap(propertySummary => {
            const property = { ...propertySummary }
            delete property.profiles

            const profiles = propertySummary.profiles || []
            return profiles.map(profile => ({
              view: profile,
              property,
              account,
            }))
          })
        })
        setFlattenedViews(flattenedViews)
      })()
    }
  }, [user, gapi])

  return flattenedViews
}

export default useAllViews
