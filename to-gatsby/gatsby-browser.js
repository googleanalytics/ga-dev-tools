// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core"
import { createMuiTheme, withStyles } from "@material-ui/core/styles"
import orange from "@material-ui/core/colors/orange"
import loadScript from "load-script"

const globalTheme = createMuiTheme({
  palette: {
    primary: orange,
  },
  typography: palette => ({
    fontFamily: ['"Roboto"', "sans-serif"].join(", "),
    h1: {
      fontSize: "2.5em",
    },
    h2: {
      fontSize: "1.75em",
      margin: "1em 0",
    },
    h3: {
      fontSize: "1.25em",
      margin: "1em 0",
    },
  }),
})

const styles = theme => ({
  "@global": {
    "html, body, #gatsby-focus-wrapper, #___gatsby": {
      height: "100%",
      margin: 0,
      padding: 0,
    },
    p: {
      paddingBottom: theme.spacing(1),
    },
    a: {
      color: theme.palette.primary[800],
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
})

// This is a bit weird, but it's the easiest way to set global css that can use
// values from the theme object.
const MyBaseline = withStyles(styles)(() => {
  return null
})

export const wrapRootElement = ({ element }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={globalTheme}>
        <MyBaseline />
        {element}
      </ThemeProvider>
    </React.Fragment>
  )
}

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
}
