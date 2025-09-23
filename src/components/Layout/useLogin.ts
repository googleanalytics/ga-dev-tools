import { Requestable, RequestStatus } from "@/types"
import { useSelector } from "react-redux"
import { useCallback, useEffect } from "react"
import { store } from "../../../gatsby/wrapRootElement"

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

function decodeJWT(token: string) {
  let base64Url = token.split(".")[1]
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join("")
  )
  return JSON.parse(jsonPayload)
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

  const handleCredentialResponse = useCallback(
    (response: any) => {
      console.log("handleCredentialResponse called", response)
      const responsePayload = decodeJWT(response.credential)
      console.log("Decoded JWT ID token fields:", responsePayload)
      store.dispatch({ type: "setUser", user: responsePayload })

      // After authenticating, trigger the authorization flow.
      login()
    },
    [login]
  )

  useEffect(() => {
    if (google && userStatus === UserStatus.SignedOut) {
      const clientId = process.env.GAPI_CLIENT_ID
      if (clientId === undefined) {
        throw new Error("GAPI_CLIENT_ID is not defined.")
      }
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      })
      const signInButton = document.getElementById("signInButton")
      if (signInButton) {
        google.accounts.id.renderButton(signInButton, {
          theme: "outline",
          size: "large",
        })
      }
    }
  }, [google, userStatus, handleCredentialResponse])

  const logout = useCallback(() => {
    if (!gapi || !google || !user) {
      return
    }
    // Revoke the token from Google's side.
    google.accounts.id.revoke(user.email, () => {
      // Also clear the gapi token to sign out of the app.
      gapi.client.setToken(null)
    })
  }, [gapi, google, user])

  if (gapiStatus === "cannot initialize") {
    return { status: RequestStatus.Failed, message: "gapi failed to initialize" }
  }

  if (gapiStatus !== "initialized" || !tokenClient) {
    return { status: RequestStatus.InProgress }
  }

  return { status: RequestStatus.Successful, userStatus, user, login, logout }
}

export default useLogin
