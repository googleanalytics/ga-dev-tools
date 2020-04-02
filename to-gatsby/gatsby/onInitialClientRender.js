import loadScript from "load-script"
import { store } from "./wrapRootElement"

export const onInitialClientRender = () => {
  /**
     Note - This is not the recommended way to use GA with gatsby. You should
     instead use:

     https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/

     The reason we do this is to demonstrate how to use GA technologies in our
     demos. See usePageview in ./src/components/layout.tsx for an example.
  */
  loadScript(
    `https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`,
    err => {
      if (err) {
        console.error("Could not load gtag.js")
        return
      }
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      gtag("js", new Date())
      window.gtag = gtag
    }
  )

  loadScript(`https://apis.google.com/js/api.js`, err => {
    if (err) {
      console.error("Could not load gapi")
      return
    }
    // TODO - think about how the ui should handle not being authorized. The way
    // we currently do it is to dim out the content, that probably still makes
    // sense, but I want to think about it before blindly doing it.
    var SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
    const clientId = `793177639245-olst43lspv93vkoql0b9l26hmpf9kfmv.apps.googleusercontent.com`

    window.gapi.load("client:auth2:analytics", () => {
      window.gapi.client
        .init({
          apiKey: "AIzaSyBs1iJjA7sf2ChWhnMziP3t2VOmNhP9nus",
          scope: SCOPES.join(" "),
          clientId,
        })
        .then(() => {
          store.dispatch({ type: "setGapi", gapi: window.gapi })
          const user = window.gapi.auth2.getAuthInstance().currentUser.get();
          store.dispatch({type: 'setUser', user: user.isSignedIn() ? user : undefined})
          window.gapi.auth2.getAuthInstance().currentUser.listen(user => {
            store.dispatch({ type: "setUser", user: user.isSignedIn() ? user : undefined})
          })
        })
    })
  })
}
