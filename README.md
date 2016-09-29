Google Analytics Demos and Tools
================================

A showcase of demos and tools built with the various Google Analytics APIs and Libraries.
**[View the Site (https://ga-dev-tools.appspot.com)](https://ga-dev-tools.appspot.com)**

## Submitting Feedback / Reporting Bugs

#### For the Demos & Tools site

- You may report bugs by [submitting an issue](https://github.com/googleanalytics/ga-dev-tools/issues/new).
- You may also submit an issue to [request a new demo or tool](https://github.com/googleanalytics/ga-dev-tools/issues/new).

#### For the Google Analytics platform

- Documentation for all Google Analytics API, libraries and SDKs can be found on [Google Analytics Developers](http://developers.google.com/analytics).
- If you have questions, please refer to the getting [help section](http://developers.google.com/analytics/help/) of the developers site to find the best place to get your questions answered.

## Building and Running the Site Locally

The Google Analytics demos and tools site runs on [Google App Engine](https://cloud.google.com/appengine/) and is built with [node.js](http://nodejs.org/). To run the site locally you'll need the following software installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v4.0+)
- [App Engine Python SDK](https://cloud.google.com/appengine/docs/python/) (v2.7+)
- [pip](https://pypi.python.org/pypi/pip)
- [GraphicsMagick](http://www.graphicsmagick.org/)

Once all dependencies are installed, follow these steps to build and run the site locally:

```sh
# Clone the repository.
git clone https://github.com/googleanalytics/ga-dev-tools.git
cd ga-dev-tools

# Install the build dependencies.
pip install -r requirements.txt -t python_modules
npm install

# Build the site and run the local App Engine server.
npm start
```

If you're wanting to load any of the pages that require server-side authorization, you'll also need to create a service account, add the private JSON key to your project's root directory, and name it `service-account-key.json`. You can follow the instructions described in the [Server-side Authorization demo](https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/) for more details.

Now you should be able to load [http://localhost:8080/](http://localhost:8080/) in your browser and see the site. (Note, the client ID associated with this project has the origin `localhost:8080` whitelisted. If you load the site on another port, authentication may not work properly.)

If you're running App Engine on Windows or Mac, you can use the App Engine Launcher GUI to run the site as an alternative to running the above command.
