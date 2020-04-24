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
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
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

const analyticsJs = <a href={Url.analyticsJSDevsite}>analytics.js</a>

const gtmExampleCode = `
// The GTM code.
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

const EnhancedEcommerce = () => {
  return (
    <Layout title="Enhanced Ecommerce">
      <Typography variant="h3">Overview</Typography>
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
        Here's an example "Add to cart" code snippet for GTM:
      </Typography>

      <CodeBlock language="javascript" code={gtmExampleCode} />
    </Layout>
  )
}
export default EnhancedEcommerce
