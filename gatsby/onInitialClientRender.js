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
              console.log("onInitialClientRender: callback invoked", tokenResponse)
              if (tokenResponse && tokenResponse.access_token) {
                gapi.client.setToken(tokenResponse.access_token)
                console.log("onInitialClientRender: setUser", tokenResponse);
                store.dispatch({ type: "setUser", user: tokenResponse })
              } else {
                console.error("onInitialClientRender: tokenResponse did not contain access_token.", tokenResponse);
                store.dispatch({ type: "setUser", user: undefined })
              }
            }, error_callback: (error) => {
              console.error("GIS Error:", error);
            },
          })

          store.dispatch({ type: "setGapi", gapi })
          store.dispatch({ type: "gapiStatus", status: "initialized" })
          store.dispatch({ type: "setGoogle", google })
          store.dispatch({ type: "setTokenClient", tokenClient })
        })    
        .catch(e => {
          store.dispatch({ type: "setGapi", gapi })
          store.dispatch({ type: "setUser", user: undefined })
          store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
          console.error(e)
        })
    })
    .catch(e => {
      console.error(e)
    })
}
