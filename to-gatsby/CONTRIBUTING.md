# Contributing

Want to contribute? Great! First, read this page (including the small print at the end).

## Technology overview

The Demos & Tools site back end runs on [Gatsby](https://www.gatsbyjs.org/) which is a React-based, GraphQL powered static site generator. Gatsby will transform the demos into directories with single HTML files and static assets.

### CSS

The CSS is using [Material UI](https://material-ui.com/styles). Text specifically should be handled with [Typography](https://material-ui.com/components/typography/).

### Images

Source images should be at 2x resolution and have their filenames end with `-2x.png`. Images should be placed in the `/images` folder. [Gatsby-Image](https://www.gatsbyjs.org/packages/gatsby-image/) handles images with [GraphQL](https://www.gatsbyjs.org/docs/graphql/)

## Adding a new demo/tool

New demos or tools can be created by following these steps:

1. Add a new folder to `/pages` with the title of the demo. Within that folder, add JSX files related to the demo, including `index.tsx`
2. If the demo/tool needs images, create a 2x-resolution image and save it to the `/images` directory.
3. If the demo/tool links to any URLs, place URL constants in `constants.ts`

## Legal

### Before you contribute

Before we can use your code, you must sign the [Google Individual Contributor License Agreement](https://developers.google.com/open-source/cla/individual?csw=1) (CLA), which you can do online. The CLA is necessary mainly because you own the copyright to your changes, even after your contribution becomes part of our codebase, so we need your permission to use and distribute your code. We also need to be sure of various other things—for instance that you'll tell us if you know that your code infringes on other people's patents. You don't have to sign the CLA until after you've submitted your code for review and a member has approved it, but you must do it before we can put your code into our codebase. Before you start working on a larger contribution, you should get in touch with us first through the issue tracker with your idea so that we can help out and possibly guide you. Coordinating up front makes it much easier to avoid frustration later on.

### Code reviews

All submissions, including submissions by project members, require review. We use Github pull requests for this purpose.

### The small print

Contributions made by corporations are covered by a different agreement than the one above, the Software Grant and Corporate Contributor License Agreement.
