import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
import CustomLayout from "./gatsby/wrapRootElement"

// TODO - look into making this work like gatsby-node & use typescript for the
// things that are imported/exported.

export { onInitialClientRender } from "./gatsby/onInitialClientRender"
export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = CustomLayout
