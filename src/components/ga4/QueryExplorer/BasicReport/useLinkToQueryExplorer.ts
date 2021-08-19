import { useMemo } from "react"
import { QueryParam } from "."
import { QueryExplorerLinkProps } from "./QueryExplorerLink"

const useLinkToQueryExplorer = (arg: QueryExplorerLinkProps) => {
  return useMemo(() => {
    const urlParams = new URLSearchParams()

    if (arg.dimensions && arg.dimensions.length > 0) {
      urlParams.append(
        QueryParam.Dimensions,
        arg.dimensions.map(d => d.apiName!).join(",")
      )
    }

    if (arg.metrics && arg.metrics.length > 0) {
      urlParams.append(
        QueryParam.Metrics,
        arg.metrics.map(m => m.apiName!).join(",")
      )
    }

    const paramString = urlParams.toString()
    const withQuestionMark = paramString === "" ? "" : `?${paramString}`

    return `/ga4/query-explorer/${withQuestionMark}`
  }, [arg])
}

export default useLinkToQueryExplorer
