import CustomLayout from "./gatsby/wrapRootElement.js"

// TODO - look into making this work like gatsby-node & use typescript for the
// things that are imported/exported.

export { onInitialClientRender } from "./gatsby/onInitialClientRender"
export const wrapPageElement = CustomLayout
