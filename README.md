Google Analytics Demos and Tools
================================

A showcase of demos and tools built with the various Google Analytics APIs and Libraries.
**[View the Site (https://ga-dev-tools.appspot.com)](https://ga-dev-tools.appspot.com)**

## Submitting Feedback / Reporting Bugs

If a demo or tool is not working as you'd expect, or if you encounter an error while using the site, please [file an issue](https://github.com/googleanalytics/ga-dev-tools/issues/new) so we can fix it.

If you've discovered a bug in one of the underlying APIs (i.e. not with the site itself), please submit a bug report on the [Google Analytics issue tracker](https://code.google.com/p/analytics-issues/).

If you have general analytics questions, please ask them on Stack Overflow with either the [google-analytics](http://stackoverflow.com/questions/tagged/google-analytics) or [google-analytics-api](http://stackoverflow.com/questions/tagged/google-analytics-api) tag, or on one of the [Google Analytics developer forums](https://developers.google.com/analytics/community/#developer-discussion-groups).

## Building and Running the Site Locally

The Google Analytics demos and tools site runs on [Google App Engine](https://cloud.google.com/appengine/) and is built with [node.js](http://nodejs.org/). To run the site locally you'll need to install App Engine and node if you don't already have them.

Once App Engine and node are installed on your system, follow these steps to build and run the site locally:

```sh
# Clone the repository.
git clone https://github.com/googleanalytics/ga-dev-tools.git
cd ga-dev-tools

# Install the build dependencies.
npm install
npm run build

# Run the local App Engine server.
path/to/dev_appserver.py .
```

Now you should be able to load [http://localhost:8080/](http://localhost:8080/) in your browser and see the site. (Note, the client ID associated with this project has the origin `localhost:8080` whitelisted. If you load the site on another port, authentication may not work property.)

If you're running App Engine on Windows or Mac, you can use the App Engine Launcher GUI to run the site as an alternative to running the above command.

To have your system watch for changes and automatically rebuild the source files, you can run `npm run watch` in place of the `npm run build` command shown above.

