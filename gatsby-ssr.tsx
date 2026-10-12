import * as React from "react"
import type { GatsbySSR } from "gatsby"
//import {StoreProvider} from "./src/components/ga4/EnhancedEcommerce/store-context"
import CustomLayout from "./gatsby/wrapRootElement"
//import "./src/styles/ecommerce/variables.css"

// TODO - look into making this work like gatsby-node & use typescript for the
// things that are imported/exported.

export const wrapPageElement: GatsbySSR["wrapPageElement"] = CustomLayout

const GOOGLE_SCRIPTS_LOADER = `(function () {
  function load(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script")
      s.src = src
      s.async = true
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }
  var gapi = load("https://apis.google.com/js/api.js").then(function () {
    return new Promise(function (resolve) {
      window.gapi.load("client", function () {
        resolve(window.gapi)
      })
    })
  })
  // Also start fetching the API discovery docs as soon as gapi is ready.
  var discovery = gapi.then(function (gapi) {
    return Promise.all([
      gapi.client.load("https://analyticsdata.googleapis.com/$discovery/rest"),
      gapi.client.load("https://analyticsadmin.googleapis.com/$discovery/rest"),
    ]).then(function () {
      return gapi
    })
  })
  var gis = load("https://accounts.google.com/gsi/client").then(function () {
    return window.google
  })
  // Avoid unhandled-rejection noise; the real handlers attach later.
  gapi.catch(function () {})
  discovery.catch(function () {})
  gis.catch(function () {})
  window.__googleScripts = { gapi: gapi, discovery: discovery, gis: gis }
})()`

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHeadComponents,
}) => {
  setHeadComponents([
    // Start loading Google's API & sign-in scripts immediately instead of
    // waiting for the app to hydrate. Picked up in onInitialClientRender.
    <script
      key="google-scripts"
      dangerouslySetInnerHTML={{ __html: GOOGLE_SCRIPTS_LOADER }}
    />,
  ])
}

// Wrap every page using a StoreProvider object used by eCommerce demo.
// export const wrapRootElement = ({ element }) => (
//     {element}
// )
