import loadScript from "load-script"
import { store } from "./wrapRootElement"

const addTokenListener = gapi => {
  let token = gapi.client.getToken()
  let tokenListener = _token => {}

  Object.defineProperty(gapi.client, "token", {
    get: () => token,
    set: newToken => {
      token = newToken
      tokenListener(token)
    },
  })

  gapi.client.setTokenListener = listener => {
    tokenListener = listener
  }
}

const handleCredentialResponse = response => {
  // The response object contains the JWT ID token in the `credential` field.
  // We can decode it to get user information.
  const user = JSON.parse(atob(response.credential.split(".")[1]))
  console.log("user", user)
  store.dispatch({ type: "setUser", user })
}

export const onInitialClientRender = () => {
  const gapiPromise = new Promise((resolve, reject) => {
    loadScript("https://apis.google.com/js/api.js", err => {
      if (err) {
        reject(err)
      } else {
        window.gapi.load("client", () => {
          addTokenListener(window.gapi)
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
      const SCOPES = "https://www.googleapis.com/auth/analytics.readonly"
      const clientId = process.env.GAPI_CLIENT_ID

      if (!clientId) {
        console.error(
          "GATSBY_GAPI_CLIENT_ID is not defined. Please check your .env file."
        )
        store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
        return
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
          const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: SCOPES,
            callback: tokenResponse => {
              gapi.client.setToken(tokenResponse)
            },
          })

          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          })

          gapi.client.setTokenListener(token => {
            if (token === null) {
              store.dispatch({ type: "setUser", user: undefined })
            }
          })

          store.dispatch({ type: "setGapi", gapi })
          store.dispatch({ type: "setGoogle", google })
          store.dispatch({ type: "setTokenClient", tokenClient })
          store.dispatch({ type: "gapiStatus", status: "initialized" })
        })
        .catch(e => {
          console.error("gapi client.load error", e)
          store.dispatch({ type: "setGapi", gapi: window.gapi })
          store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
        })
    })
    .catch(err => {
      console.error("Could not load gapi or gis", err)
      store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
    })
}