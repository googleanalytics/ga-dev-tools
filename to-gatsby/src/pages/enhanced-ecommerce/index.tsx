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

import * as React from "react"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { Url } from "../../constants"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../../components/layout"
import CodeBlock from "../../components/CodeBlock"

const useStyles = makeStyles(theme => ({
  demoScreenshot: {
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[500]}`,
  },
  codeBlock: {
    marginBottom: theme.spacing(2),
  },
}))

const DemoScreenshot = () => {
  const classes = useStyles()
  const data = useStaticQuery(graphql`
    query {
      partners: file(
        relativePath: { eq: "screenshots/enhanced-ecommerce-2x.png" }
      ) {
        childImageSharp {
          fluid(quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Img
      className={classes.demoScreenshot}
      fluid={data.partners.childImageSharp.fluid}
      alt="A screenshot from the Enhanced Ecommerce demo."
    />
  )
}

const demoStore = (
  <a href={Url.enhancedEcommerceDemo}>Enhanced Ecommerce Demo Store</a>
)

const enhancedEcommerceHelp = (
  <a href={Url.enhancedEcommerceHelpCenter}>Enhanced Ecommerce</a>
)

const googleTagManager = (
  <a href={Url.googleTagManagerEnhancedEcommerce}>Google Tag Manager</a>
)

const enhancedEcommerceAnalyticsJs = (
  <a href={Url.analyticsJSEnhancedEcommerce}>Enhanced Ecommerce (ec.js)</a>
)

const gaDebugger = <a href={Url.gaDebugger}>Google Analytics Debugger</a>

const analyticsJs = <a href={Url.analyticsJSDevsite}>analytics.js</a>

const gtmExampleCode = `
dataLayer.push({
  "event": "addToCart",
    "ecommerce": {
      "currencyCode": "USD",
      "add": {
        "products": [{
          "id": "57b9d",
          "name": "Kiosk T-Shirt",
          "price": "55.00",
          "brand": "Kiosk",
          "category": "T-Shirts",
          "variant": "red",
          "dimension1": "M",
          "quantity": 1
        }]
      }
    }
});
`.trim()

const ecJsExampleCode = `
ga("create", "UA-XXXXX-Y");
ga("require", "ec");
ga("ec:addProduct", {
  "id": "57b9d",
  "name": "Kiosk T-Shirt",
  "price": "55.00",
  "brand": "Kiosk",
  "category": "T-Shirts",
  "variant": "red",
  "dimension1": "M",
  "quantity": 1
});
ga("ec:setAction", "add");
ga("send", "event", "detail view", "click", "addToCart");
`.trim()

const codeBlocks = [
  { code: gtmExampleCode, title: "Google Tag Manager" },
  { code: ecJsExampleCode, title: "ec.js" },
]

const EnhancedEcommerce = () => {
  const classes = useStyles()
  return (
    <Layout title="Enhanced Ecommerce">
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        The {demoStore} is a sample ecommerce application with a complete
        implementation of {enhancedEcommerceHelp}. Use this demo to understand
        how the Enhanced Ecommerce code works, and what is required to implement
        it on your own site.
      </Typography>

      <a href={Url.enhancedEcommerceDemo}>
        <DemoScreenshot />
      </a>
      <Typography variant="body1">
        Every action in this demo comes with code samples showing exactly how
        the feature is implemented. The samples include code for both{" "}
        {googleTagManager} and the {enhancedEcommerceAnalyticsJs} plugin for{" "}
        {analyticsJs}.
      </Typography>

      <Typography variant="body1">
        The following is an example "Add to cart" event:
      </Typography>

      <CodeBlock
        language="javascript"
        codeBlocks={codeBlocks}
        className={classes.codeBlock}
      />

      <Typography variant="body1">
        The demo doesn't just show samples, it's actually sending real data to
        Google Analytics. If you'd like to inspect the hits, just open up the
        developer tools or use the {gaDebugger} to see what's going on.
      </Typography>
    </Layout>
  )
}
export default EnhancedEcommerce
