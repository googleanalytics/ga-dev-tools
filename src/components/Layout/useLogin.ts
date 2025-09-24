import { Requestable, RequestStatus } from "@/types"
import { useState, useEffect, useCallback } from "react"

import { useSelector, useDispatch } from "react-redux"

export enum UserStatus {
  SignedIn,
  SignedOut,
  Pending,
}

interface Successful {
  userStatus: UserStatus
  user: any
  logout: () => void
  login: () => void
}
interface InProgress {}
interface Failed {
  message: string
}
const useLogin = (): Requestable<Successful, {}, InProgress, Failed> => {
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)
  const token = useSelector((state: AppState) => state.token)
  const gapi = useSelector((state: AppState) => state.gapi)
  const gapiStatus = useSelector((state: AppState) => state.gapiStatus)
  const tokenClient = useSelector((state: AppState) => state.tokenClient)
  const google = useSelector((state: AppState) => state.google)
  const dispatch = useDispatch()
  const userStatus = token ? UserStatus.SignedIn : UserStatus.SignedOut

  const login = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken()
    }
  }, [tokenClient])

  const logout = useCallback(() => {
    const token = gapi?.client.getToken()
    if (token && google) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi?.client.setToken(null)
        dispatch({ type: "setToken", token: undefined })
        localStorage.removeItem("google_token")
      })
    }
  }, [gapi, google, dispatch])

  useEffect(() => {
    if (gapiStatus === "cannot initialize") {
      setRequestStatus(RequestStatus.Failed)
      return
    }
    if (gapi === undefined) {
      return
    }

    if (
      requestStatus === RequestStatus.Successful ||
      requestStatus === RequestStatus.Failed ||
      requestStatus === RequestStatus.InProgress
    ) {
      return
    }

    if (requestStatus === RequestStatus.NotStarted) {
      setRequestStatus(RequestStatus.InProgress)
    }

    setRequestStatus(RequestStatus.Successful)
  }, [gapi, requestStatus, gapiStatus])

  if (requestStatus === RequestStatus.Successful) {
    return { status: requestStatus, userStatus, user: token, login, logout }
  }
  if (requestStatus === RequestStatus.Failed) {
    return { status: requestStatus, message: gapiStatus || "unknown" }
  }

  return { status: requestStatus }
}

export default useLogin