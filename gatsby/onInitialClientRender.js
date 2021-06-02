import loadScript from "load-script"
import { store } from "./wrapRootElement"

export const onInitialClientRender = () => {
  loadScript(`https://apis.google.com/js/api.js`, err => {
    if (err) {
      console.error("Could not load gapi")
      return
    }

    var SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

    const clientId = process.env.GAPI_CLIENT_ID

    // TODO - Remove :analytics and replace it with the discovery document.
    window.gapi.load("client:auth2:analytics", () => {
      Promise.all([
        window.gapi.client.load(
          "https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"
        ),
        window.gapi.client.load(
          "https://analyticsdata.googleapis.com/$discovery/rest"
        ),
        window.gapi.client.load(
          "https://analyticsadmin.googleapis.com/$discovery/rest"
        ),
      ]).then(() => {
        window.gapi.client
          .init({
            scope: SCOPES.join(" "),
            clientId,
          })
          .then(() => {
            store.dispatch({ type: "setGapi", gapi: window.gapi })
            const user = window.gapi.auth2.getAuthInstance().currentUser.get()
            store.dispatch({
              type: "setUser",
              user: user.isSignedIn() ? user : undefined,
            })
            window.gapi.auth2.getAuthInstance().currentUser.listen(user => {
              store.dispatch({
                type: "setUser",
                user: user.isSignedIn() ? user : undefined,
              })
            })
          })
          .catch(e => {
            store.dispatch({ type: "setGapi", gapi: window.gapi })
            store.dispatch({
              type: "setUser",
              user: undefined,
            })
            store.dispatch({
              type: "gapiStatus",
              status: "cannot initialize",
            })
            console.error(e)
          })
      }, console.error)
    })
  })
}
