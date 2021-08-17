import { RequestStatus } from "@/types"
import { useCallback, useState } from "react"

const useRequestStatus = (initialStatus?: RequestStatus) => {
  const [status, setStatus] = useState<RequestStatus>(
    initialStatus || RequestStatus.NotStarted
  )

  const setNotStarted = useCallback(() => {
    setStatus(RequestStatus.NotStarted)
  }, [])

  const setInProgress = useCallback(() => {
    setStatus(RequestStatus.InProgress)
  }, [])

  const setFailed = useCallback(() => {
    setStatus(RequestStatus.Failed)
  }, [])

  const setSuccessful = useCallback(() => {
    setStatus(RequestStatus.Successful)
  }, [])

  return { status, setNotStarted, setInProgress, setFailed, setSuccessful }
}

export default useRequestStatus
