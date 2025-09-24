import loadScript from "load-script"
import { store } from "./wrapRootElement"

export const onInitialClientRender = () => {
  const gapiPromise = new Promise((resolve, reject) => {
    loadScript("https://apis.google.com/js/api.js", err => {
      if (err) {
        reject(err)
      } else {
        window.gapi.load("client", () => {
          resolve(window.gapi)
        })
      }
    })
  })

  const gisPromise = new Promise((resolve, reject) => {
    loadScript("https://accounts.google.com/gsi/client", err => {
      if (err) {
        reject(err)
      } else resolve(window.google)
    })
  })

  Promise.all([gapiPromise, gisPromise])
    .then(([gapi, google]) => {
      const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
      const clientId = process.env.GAPI_CLIENT_ID

      if (!clientId) {
        console.error(
          "GAPI_CLIENT_ID is not defined. Please check your .env file."
        )
        store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
        return
      }

      // Google Sign-In previously helped manage user signed-in status
      // With GIS we are responsible for managing sign-in state
      try {
        const storedTokenString = localStorage.getItem("google_token")
        if (storedTokenString) {
          console.log("Restoring token from localStorage...")
          const storedToken = JSON.parse(storedTokenString)
          if (storedToken.expires_at > Date.now()) {
            console.log("Token is still valid, using it...")
            gapi.client.setToken(storedToken)
            store.dispatch({ type: "setToken", token: storedToken })
          } else {
            localStorage.removeItem("google_token")
          }
        }
      } catch (e) {
        console.error("Unable to restore token from localStorage:", e)
        localStorage.removeItem("google_token")
      }

      Promise.all([
        gapi.client.load(
          "https://analyticsdata.googleapis.com/$discovery/rest"
        ),
        gapi.client.load(
          "https://analyticsadmin.googleapis.com/$discovery/rest"
        ),
      ])
        .then(() => {
          console.log("Initializing token client...")
          // Replace gapi.auth2.init() with google.accounts.oauth2.initTokenClient()
          const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: SCOPES.join(" "),
            callback: tokenResponse => {
              if (tokenResponse && tokenResponse.access_token) {
                const tokenWithExpiry = {
                  ...tokenResponse,
                  expires_at: Date.now() + tokenResponse.expires_in * 1000,
                }
                localStorage.setItem("google_token", JSON.stringify(tokenWithExpiry))
                gapi.client.setToken(tokenResponse)
                store.dispatch({ type: "setToken", token: tokenResponse })
              } else {
                store.dispatch({ type: "setToken", token: undefined })
              }
            }
          })

          store.dispatch({ type: "setGapi", gapi })
          store.dispatch({ type: "gapiStatus", status: "initialized" })
          store.dispatch({ type: "setGoogle", google })
          store.dispatch({ type: "setTokenClient", tokenClient })
        })
        .catch(e => {
          store.dispatch({ type: "setGapi", gapi })
          store.dispatch({ type: "setToken", token: undefined })
          store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
          console.error(e)
        })
    })
    .catch(e => {
      console.error(e)
    })
}
