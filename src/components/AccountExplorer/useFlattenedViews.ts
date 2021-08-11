import { useMemo } from "react"
import { UAAccountPropertyView } from "../ViewSelector/useAccountPropertyView"
import useAccounts from "../ViewSelector/useAccounts"

const useFlattenedViews = (): UAAccountPropertyView[] | undefined => {
  const accounts = useAccounts()

  return useMemo(
    () =>
      accounts?.flatMap<UAAccountPropertyView>(summary => {
        const account = { ...summary }

        const properties = summary.webProperties || []
        return properties.flatMap(propertySummary => {
          const property = { ...propertySummary }

          const profiles = propertySummary.profiles || []
          return profiles.map(profile => ({
            view: profile,
            property,
            account,
          }))
        })
      }),
    [accounts]
  )
}

export default useFlattenedViews
