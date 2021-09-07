import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import { Requestable, RequestStatus } from "@/types"
import { Column } from "@/types/ua"
import moment from "moment"
import { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"

const useColumns = (): Requestable<
  { columns: Column[] },
  {},
  {},
  { error: any }
> => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const metadataAPI = useMemo(() => gapi?.client?.analytics?.metadata, [gapi])

  const requestReady = useMemo(() => metadataAPI !== undefined, [metadataAPI])

  const makeRequest = useCallback(async () => {
    if (metadataAPI === undefined) {
      throw new Error("Invalid invariant - metadataAPI must be defined here.")
    }
    return metadataAPI.columns
      .list({ reportType: "ga" })
      .then(response => response.result.items)
  }, [metadataAPI])

  const columnsRequest = useCached(
    StorageKey.dimensionsMetricsExplorerColumns,
    makeRequest,
    moment.duration(5, "minutes"),
    requestReady
  )

  return useMemo(() => {
    switch (columnsRequest.status) {
      case RequestStatus.Successful: {
        const columns = columnsRequest.value
        if (columns === undefined) {
          throw new Error("invalid invarint - columns must be defined here")
        }
        return { status: columnsRequest.status, columns }
      }
      case RequestStatus.NotStarted:
      case RequestStatus.InProgress:
        return { status: columnsRequest.status }
      case RequestStatus.Failed: {
        return columnsRequest
      }
    }
  }, [columnsRequest])
}

export default useColumns
