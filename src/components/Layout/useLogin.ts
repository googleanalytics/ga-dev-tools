import { Requestable, RequestStatus } from "@/types"
import { useSelector, useDispatch } from "react-redux"
import { useCallback } from "react"

export enum UserStatus {
  SignedIn,
  SignedOut,
}

interface Successful {
  userStatus: UserStatus
  user: User | undefined
  logout: () => void
  login: () => void
}

interface InProgress {}
interface Failed {
  message: string
}

const useLogin = (): Requestable<Successful, {}, InProgress, Failed> => {
  const user = useSelector((state: AppState) => state.user)
  const tokenClient = useSelector((state: AppState) => state.tokenClient)
  const gapiStatus = useSelector((state: AppState) => state.gapiStatus)
  const gapi = useSelector((state: AppState) => state.gapi)
  const google = useSelector((state: AppState) => state.google)

  const userStatus = user ? UserStatus.SignedIn : UserStatus.SignedOut

  const login = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken({})
    }
  }, [tokenClient])

  const logout = useCallback(() => {
    const token = gapi?.client.getToken()
    if (token !== null && token !== undefined) {
      google.accounts.auth2.revoke(token.access_token, () => {
        gapi?.client.setToken(null)
      })
    }
  }, [gapi])

  if (gapiStatus === "cannot initialize") {
    return { status: RequestStatus.Failed, message: "gapi failed to initialize" }
  }

  if (gapiStatus !== "initialized" || !tokenClient) {
    return { status: RequestStatus.InProgress }
  }

  return { status: RequestStatus.Successful, userStatus, user, login, logout }
}

export default useLogin
