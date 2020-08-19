# GA Demos & Tools

A showcase of demos and tools built with the various Google Analytics APIs and
Libraries. **[View the Site]**

## Submitting Feedback / Reporting Bugs

### For the Demos & Tools site

- You may report bugs by [submitting an issue].
- You may also submit an issue to [request a new demo or tool].

### For the Google Analytics platform

- Documentation for all Google Analytics API, libraries and SDKs can be found
  on [Google Analytics Developers].
- If you have questions, please refer to the getting [help section] of the
  developers site to find the best place to get your questions answered.

## Building and running the site locally

To run the site locally, first make sure you have all the dependencies
installed:

Prerequirements:

- [`Yarn`](https://classic.yarnpkg.com/en/docs/install)

```shell
npm install
```

Then simply run the following:

```shell
env GATSBY_GA_MEASUREMENT_ID=YOUR_ID npm run start
```

This will set up a local hot-reloading instance of the app that you'll be able
to navigate to by going to `http://localhost:8000`

## Whats in this repo

### `./src`

This is where all (technically most, see [gatsby-browser.js]) of the
client-side code lives. All of our demo code can be found here.

### gatsby-browser.js

This file is used to add additional functionality at browser runtime. Since, for
the most part, Gatsby outputs static js this file is useful to decorate our app
with functionality that is needed at runtime.

Of note, we use:

- [`wrapRootElement`](https://www.gatsbyjs.org/docs/browser-apis/#wrapRootElement)

  Lets us wrap the root element in any necessary context/providers. We use it
  for injecting a material-ui
  [Theme provider](https://material-ui.com/customization/theming/#theme-provider),
  and a Redux store.

- [`onInitialClientRender`](https://www.gatsbyjs.org/docs/browser-apis/#onInitialClientRender)

  Let's us pull in gtag only on the first render of the site. It's mentioned
  in the comment in the code, but we don't recommend loading gtag this way.
  You should instead use
  [gatsby-plugin-google-analytics](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/)

  The reason we use `onInitialClientRender` is so we can demonstrate how to
  use GA technologies in our demos.

  This code additionally pulls in gapi, a Google library that makes calling
  Google APIs much easier.

Also see [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/).

### gatsby-config.js

This is the main configuration file for our Gatsby site. All of our gatsby
plugins are configured here.

- [gatsby-plugin-prefetch-google-fonts](https://www.gatsbyjs.org/packages/gatsby-plugin-prefetch-google-fonts/)

  Allows us to download/prefetch Google Fonts. From their docs: "Can increase
  performance as opposed to loading webfonts from Google's external
  stylesheet."

- [gatsby-plugin-react-svg](https://www.gatsbyjs.org/packages/gatsby-plugin-react-svg/)

  Makes it easy to load in SVGs as React components via the following stanza:

  ```
  import SVGComponentName from "-!svg-react-loader!../images/svg-name.svg"
  ```

- [gatsby-plugin-typescript](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/)

  Provides drop-in support for Typescript and TSX. `<opinion>`For a site like
  this, that has demos that will live over many years, typescript is a very
  handy way to make it easier to jump back in the code.`</opinion`

- [gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/)

  Lets us source data into the app that can be queried via graphql.

- [gatsby-transformer-sharp] & [gatsby-plugin-sharp]

Also see [Gatsby Config API](https://www.gatsbyjs.org/docs/gatsby-config/).

### .prettierrc

This is used to configure [prettier], an opinionated code formatter that helps
keep the code looking consistent.

[view the site]: https://ga-dev-tools.appspot.com
[submitting an issue]: https://github.com/googleanalytics/ga-dev-tools/issues/new
[request a new demo or tool]: https://github.com/googleanalytics/ga-dev-tools/issues/new
[google analytics developers]: http://developers.google.com/analytics
[help section]: http://developers.google.com/analytics/help/
[gatsby-broweser.js]: #gatsby-browser.js
[gatsby-transformer-sharp]: https://www.gatsbyjs.org/packages/gatsby-transformer-sharp/
[gatsby-plugin-sharp]: https://www.gatsbyjs.org/packages/gatsby-plugin-sharp/
[prettier]: https://prettier.io/
