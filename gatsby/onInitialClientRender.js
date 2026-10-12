import loadScript from "load-script"
import { store } from "./wrapRootElement"

// Fetches the signed-in user's name, email & photo. Tokens granted before the
// profile scopes were added get a 401 here, so the profile is just left empty.
const fetchProfile = token => {
  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
    .then(response => (response.ok ? response.json() : undefined))
    .then(profile => {
      if (profile) {
        store.dispatch({
          type: "setProfile",
          profile: {
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
          },
        })
      }
    })
    .catch(e => console.error("Unable to load the user's profile:", e))
}

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
      const SCOPES = [
        "https://www.googleapis.com/auth/analytics.readonly",
        "openid",
        "email",
        "profile",
      ]
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
          const storedToken = JSON.parse(storedTokenString)
          if (storedToken.expires_at > Date.now()) {
            gapi.client.setToken(storedToken)
            store.dispatch({ type: "setToken", token: storedToken })
            fetchProfile(storedToken)
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
                fetchProfile(tokenResponse)
              } else {
                store.dispatch({ type: "setToken", token: undefined })
              }
            }
          })

          store.dispatch({ type: "setGapi", gapi })
          store.dispatch({ type: "gapiStatus", status: "initialized" })
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
