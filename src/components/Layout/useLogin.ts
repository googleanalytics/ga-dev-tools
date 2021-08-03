import { Requestable, RequestStatus } from "@/types"
import { useState, useEffect, useCallback } from "react"

import { useSelector } from "react-redux"

export enum UserStatus {
  SignedIn,
  SignedOut,
  Pending,
}

interface Successful {
  userStatus: UserStatus
  user: gapi.auth2.GoogleUser | undefined
  logout: () => void
  login: () => void
}
interface InProgress {}
interface Failed {
  message: string
}
const useLogin = (): Requestable<Successful, {}, InProgress, Failed> => {
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)
  const user = useSelector((state: AppState) => state.user)
  const gapi = useSelector((state: AppState) => state.gapi)
  const gapiStatus = useSelector((state: AppState) => state.gapiStatus)
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.Pending)

  const login = useCallback(() => {
    if (gapi === undefined) {
      return
    }
    gapi.auth2.getAuthInstance().signIn()
  }, [gapi])

  const logout = useCallback(() => {
    if (gapi === undefined) {
      return
    }
    gapi.auth2.getAuthInstance().signOut()
  }, [gapi])

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

    gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
      setUserStatus(signedIn ? UserStatus.SignedIn : UserStatus.SignedOut)
    })

    gapi.auth2.getAuthInstance().isSignedIn.get()
      ? setUserStatus(UserStatus.SignedIn)
      : setUserStatus(UserStatus.SignedOut)

    setRequestStatus(RequestStatus.Successful)
  }, [gapi, requestStatus, gapiStatus])

  if (requestStatus === RequestStatus.Successful) {
    return { status: requestStatus, userStatus, user, login, logout }
  }
  if (requestStatus === RequestStatus.Failed) {
    return { status: requestStatus, message: gapiStatus || "unknown" }
  }

  return { status: requestStatus }
}

export default useLogin
