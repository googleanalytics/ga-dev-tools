import * as React from "react"
import {StoreProvider} from "./src/components/ga4/EnhancedEcommerce/store-context"
import CustomLayout from "./gatsby/wrapRootElement.js"
import "./src/styles/ecommerce/variables.css"

// TODO - look into making this work like gatsby-node & use typescript for the
// things that are imported/exported.

export { onInitialClientRender } from "./gatsby/onInitialClientRender"
export const wrapPageElement = CustomLayout

// Wrap every page using a StoreProvider object used by eCommerce demo.
export const wrapRootElement = ({ element }) => (
    <StoreProvider>{element}</StoreProvider>
)