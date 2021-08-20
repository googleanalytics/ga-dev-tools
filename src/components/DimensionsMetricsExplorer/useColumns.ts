import { StorageKey } from "@/constants"
import useCached from "@/hooks/useCached"
import useRequestStatus from "@/hooks/useRequestStatus"
import { Requestable, RequestStatus } from "@/types"
import moment from "moment"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

const useColumns = (): Requestable<
  { columns: gapi.client.analytics.Column[] },
  {},
  {},
  { errorData: any }
> => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const metadataAPI = useMemo(() => gapi?.client.analytics.metadata, [gapi])
  const { status, setSuccessful, setFailed, setInProgress } = useRequestStatus()

  const requestReady = useMemo(() => metadataAPI !== undefined, [metadataAPI])
  const [errorData, setErrorData] = useState<any>()

  const makeRequest = useCallback(async () => {
    if (metadataAPI === undefined) {
      throw new Error("Invalid invariant - metadataAPI must be defined here.")
    }
    setInProgress()
    return metadataAPI.columns
      .list({ reportType: "ga" })
      .then(response => response.result.items)
      .catch(e => {
        console.error(e)
        setErrorData(e)
        setFailed()
      })
  }, [metadataAPI, setFailed, setInProgress])

  const columns = useCached(
    StorageKey.dimensionsMetricsExplorerColumns,
    makeRequest,
    moment.duration(5, "minutes"),
    requestReady
  )

  useEffect(() => {
    if (columns !== undefined) {
      setSuccessful()
    }
  }, [columns, setSuccessful])

  if (columns !== undefined || status === RequestStatus.Successful) {
    if (columns === undefined) {
      throw new Error("Invalid invariant - columns must be defined here.")
    }
    return { status: RequestStatus.Successful, columns }
  }
  if (status === RequestStatus.Failed) {
    return { status, errorData }
  }
  return { status }
}

export default useColumns
