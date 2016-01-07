# Contributing

Want to contribute? Great! First, read this page (including the small print at the end).


## Technology overview

The Demos & Tools site back end runs on [Google App Engine for Python](https://cloud.google.com/appengine/docs/python/) using the [webapp2](https://webapp-improved.appspot.com/) framework and [Jinja2](http://jinja.pocoo.org/) templates. Its front-end code is written in JavaScript (ES2015) and [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html), compiled to ES5 via [Babel](https://babeljs.io/), and built using [Webpack](https://webpack.github.io/) and [Gulp](http://gulpjs.com/).

### Templates

The templates get their data primarily from the `meta.yaml` file. It contains all of the demo/tool names as well as site-wide information and common links. The navigation is populated from the list of projects, and each project can optionally have a list of pages.

### Routes / request handlers

The `BaseHandler` class handles all requests that do not require any back-end logic and fit into the `<project>/<page>` hierarchy. Demos/tools that require additional logic can create their own handlers and add them to the routes in `lib/app.`

### Authentication

Authorization is handled site-wide via the [Embed API](https://developers.google.com/analytics/devguides/reporting/embed/), and both client-side and server-side authorization is supported. Demos/tools that require authorization can either extend the `user-auth.html` template or the `server-auth.html` template. Server-side authorization grants read-only API access to the Demos & Tools appspot.com view.

### JavaScript

The JavaScript build system is configured to generate several JavaScript files: one file called `app.js`, which includes all modules common to the entire site, and several project-specific files that contain only the modules referenced by that particular project.

The dependency tree is automatically determined by Webpack, so you don't have to worry about it. Any file matching `src/javascript/**/index.js` will generate its own output file and you can reference it in the templates.

### CSS

The CSS is compiled using [PostCSS](https://github.com/postcss/postcss) via [CSSNext](http://cssnext.io/) and roughly follows the [SuitCSS](http://suitcss.github.io/) methodology. New demos/tools that require additional styling should try to use or extend existing styles before creating their own one-off styles.

### Images

Source images should be at 2x resolution and have their filenames end with `-2x.png`. The build system automatically creates non-2x versions of the files without the `-2x` in the filename. `<img>` elements in the templates should use the [`srcset`](https://webkit.org/demos/srcset/) attribute to indicate which version of the image to use.


## Adding a new demo/tool

New demos or tools can be created by following these steps:

1. Add the demo/tool's project information to `meta.yaml`. Refer to the existing entires to see what kind of information needs to be included.
2. Create a template file at `templates/<project-slug>/index.html`, where `<project-slug>` is the value from `meta.yaml`. If the project has pages, create additional files at `templates/<project-slug>/<page-slug>.html`. Refer to the `templates/embed-api` directory for an example of a project that contains pages.
3. If the demo/tool does not require any back-end functionality then it does not need its own request handler. Adding its data to the `meta.yaml` file is sufficient to have the default handler automatically detect it. If it does require back-end functionality, refer to `lib/app` and `lib/handlers/server_side_auth.py` for an example of how add a new request handler for a specific project.
4. If the demo/tool requires JavaScript, add a new JavaScript entry file at `src/javascript/<project-name>/index.js`. Any dependencies you need should be imported at the top of this file (refer to `lib/javascript/hit-builder/index.js` for an example). The build process will automatically detect new entry points and create a corresponding output file at `public/javascript/<project-slug>.js` that you can reference from your template in the `foot_scripts` block.
5. If the demo/tool needs images, create a 2x-resolution image and save it to the `src/images` directory. Images with the `-2x.png` suffix are automatically converted to their `1x` equivalents at build time and output to `public/images`. To reference the image in a template, refer to `template/spreadsheet-add-on/index.html` for an example.


## Legal

### Before you contribute

Before we can use your code, you must sign the [Google Individual Contributor License Agreement](https://developers.google.com/open-source/cla/individual?csw=1) (CLA), which you can do online. The CLA is necessary mainly because you own the copyright to your changes, even after your contribution becomes part of our codebase, so we need your permission to use and distribute your code. We also need to be sure of various other things—for instance that you'll tell us if you know that your code infringes on other people's patents. You don't have to sign the CLA until after you've submitted your code for review and a member has approved it, but you must do it before we can put your code into our codebase. Before you start working on a larger contribution, you should get in touch with us first through the issue tracker with your idea so that we can help out and possibly guide you. Coordinating up front makes it much easier to avoid frustration later on.

### Code reviews

All submissions, including submissions by project members, require review. We use Github pull requests for this purpose.

### The small print

Contributions made by corporations are covered by a different agreement than the one above, the Software Grant and Corporate Contributor License Agreement.
