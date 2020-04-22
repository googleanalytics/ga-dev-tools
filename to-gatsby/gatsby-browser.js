import loadScript from "load-script"
import CustomLayout from './gatsby/wrapRootElement.js'

export const wrapPageElement = CustomLayout

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
