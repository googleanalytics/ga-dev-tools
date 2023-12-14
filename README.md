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

### Requirements

- [`Yarn`](https://classic.yarnpkg.com/en/docs/install)

  This site is only tested and developed using yarn.

### Running

To run the site locally, first make sure you have all the dependencies
installed:

```shell
yarn
```

Also make sure to install the dependencies in the `lib` directory.

```shell
cd lib
yarn
cd ..
```

Then run the following (from the top level directory) and answer all prompts:

```shell
yarn start:app:production
```

> All prompts can be skipped, but certain demos rely on prompt answers to fully
> function. Notably, any demo that requries authentication will require you to
> put in a valid Google client ID.

This will set up a local hot-reloading instance of the app that can try out at
`http://localhost:5000`

### Testing

To run tests, first make sure you have all the dependencies installed:

```shell
yarn
```

Then run the following:

```shell
yarn test
```

## Whats in this repo

### `./src`

This is where the majority of the client-side code lives. All of our demo code
can be found here.

### `./gatsby-browser.js`

This file is useful to decorate our app with functionality that is needed at
runtime.

Of note, we use:

- [`wrapRootElement`](https://www.gatsbyjs.org/docs/browser-apis/#wrapRootElement)

  Lets us wrap the root element in any necessary context/providers. We use it
  for injecting a material-ui
  [Theme provider](https://material-ui.com/customization/theming/#theme-provider),
  and a Redux store.

- [`onInitialClientRender`](https://www.gatsbyjs.org/docs/browser-apis/#onInitialClientRender)

  Any code that should run once after the client renders goes here.

  This code pulls in and configures
  [gapi](https://github.com/google/google-api-javascript-client), a Google
  library that makes calling Google APIs from javascript a breeze.

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
  this, with demos that will live over many years, typescript is a handy way to
  make it easier to jump back in the code.`</opinion>`

- [gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/)

  Lets us source data into the app that can be queried via graphql.

Also see [Gatsby Config API](https://www.gatsbyjs.org/docs/gatsby-config/).

[view the site]: https://ga-dev-tools.web.app
[submitting an issue]: https://github.com/googleanalytics/ga-dev-tools/issues/new
[request a new demo or tool]: https://github.com/googleanalytics/ga-dev-tools/issues/new
[google analytics developers]: http://developers.google.com/analytics
[help section]: http://developers.google.com/analytics/help/
[gatsby-broweser.js]: #gatsby-browser.js
[gatsby-transformer-sharp]: https://www.gatsbyjs.org/packages/gatsby-transformer-sharp/
[gatsby-plugin-sharp]: https://www.gatsbyjs.org/packages/gatsby-plugin-sharp/
