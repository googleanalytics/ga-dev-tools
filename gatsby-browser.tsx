import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
//import {StoreProvider} from "./src/components/ga4/EnhancedEcommerce/store-context"
import CustomLayout from "./gatsby/wrapRootElement"
//import "./src/styles/ecommerce/variables.css"

// TODO - look into making this work like gatsby-node & use typescript for the
// things that are imported/exported.

export { onInitialClientRender } from "./gatsby/onInitialClientRender"
export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = CustomLayout

// Wrap every page using a StoreProvider object used by eCommerce demo.
// export const wrapRootElement = ({ element }) => (
//     {element}
// )
