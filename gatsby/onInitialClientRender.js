import loadScript from "load-script"
import { store } from "./wrapRootElement"

const loadGapi = () =>
  new Promise((resolve, reject) => {
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

const loadGis = () =>
  new Promise((resolve, reject) => {
    loadScript("https://accounts.google.com/gsi/client", err => {
      if (err) {
        reject(err)
      } else resolve(window.google)
    })
  })

// Google sign-in previously managed signed-in status. With GIS we restore the
// token from localStorage ourselves.
const restoreToken = gapi => {
  try {
    const storedTokenString = localStorage.getItem("google_token")
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString)
      if (storedToken.expires_at > Date.now()) {
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
}

export const onInitialClientRender = () => {
  const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
  const clientId = process.env.GAPI_CLIENT_ID

  if (!clientId) {
    console.error("GAPI_CLIENT_ID is not defined. Please check your .env file.")
    store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
    return
  }

  // The scripts are normally already loading from a <head> tag added in
  // gatsby-ssr; fall back to loading them here.
  const preloaded = window.__googleScripts
  const gisPromise = preloaded ? preloaded.gis : loadGis()
  // Load the API discovery docs as soon as gapi is ready, without waiting for
  // the sign-in script.
  const discoveryPromise = (
    preloaded
      ? preloaded.discovery
      : loadGapi().then(gapi =>
          Promise.all([
            gapi.client.load(
              "https://analyticsdata.googleapis.com/$discovery/rest"
            ),
            gapi.client.load(
              "https://analyticsadmin.googleapis.com/$discovery/rest"
            ),
          ]).then(() => gapi)
        )
  ).then(gapi => {
    restoreToken(gapi)
    return gapi
  })

  Promise.all([discoveryPromise, gisPromise])
    .then(([gapi, google]) => {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES.join(" "),
        callback: tokenResponse => {
          if (tokenResponse && tokenResponse.access_token) {
            const tokenWithExpiry = {
              ...tokenResponse,
              expires_at: Date.now() + tokenResponse.expires_in * 1000,
            }
            localStorage.setItem(
              "google_token",
              JSON.stringify(tokenWithExpiry)
            )
            gapi.client.setToken(tokenResponse)
            store.dispatch({ type: "setToken", token: tokenResponse })
          } else {
            store.dispatch({ type: "setToken", token: undefined })
          }
        },
      })

      store.dispatch({ type: "setGapi", gapi })
      store.dispatch({ type: "gapiStatus", status: "initialized" })
      store.dispatch({ type: "setTokenClient", tokenClient })
    })
    .catch(e => {
      if (window.gapi) {
        store.dispatch({ type: "setGapi", gapi: window.gapi })
      }
      store.dispatch({ type: "setToken", token: undefined })
      store.dispatch({ type: "gapiStatus", status: "cannot initialize" })
      console.error(e)
    })
}
