import * as React from "react"
import type { GatsbySSR } from "gatsby"
//import {StoreProvider} from "./src/components/ga4/EnhancedEcommerce/store-context"
import CustomLayout from "./gatsby/wrapRootElement"
//import "./src/styles/ecommerce/variables.css"

// TODO - look into making this work like gatsby-node & use typescript for the
// things that are imported/exported.

export const wrapPageElement: GatsbySSR["wrapPageElement"] = CustomLayout

// Wrap every page using a StoreProvider object used by eCommerce demo.
// export const wrapRootElement = ({ element }) => (
//     {element}
// )
