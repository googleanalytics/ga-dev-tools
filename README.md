Google Analytics Embed API Demos
================================

This repo showcases many of the things that are possible with the [Embed API](https://developers.google.com/analytics/devguides/reporting/embed/v1/). Each demo builds on ideas presented in the previous demo, so you should check them out in order. If you're curious how anything is done, browse around in the code to see for yourself.

#### [View Demos](http://ga-dev-tools.appspot.com/demos/embed-api/) →

## Demos Source Code

* [Basic Dashboard](https://github.com/googleanalytics/embed-api-demos/blob/master/site/1-basic-dashboard.html)
* [Multiple Views](https://github.com/googleanalytics/embed-api-demos/blob/master/site/2-multiple-views.html)
* [Multiple Date Ranges](https://github.com/googleanalytics/embed-api-demos/blob/master/site/3-multiple-dates.html)
* [Interactive Charts](https://github.com/googleanalytics/embed-api-demos/blob/master/site/4-interactive-charts.html)
* [Third-Party Visualizations](https://github.com/googleanalytics/embed-api-demos/blob/master/site/5-third-party-visualizations.html)
* [Pure HTML Dashboards](https://github.com/googleanalytics/embed-api-demos/blob/master/site/6-pure-html-dashboards.html)

## Custom Components Source Code

* [Datepicker](https://github.com/googleanalytics/embed-api-demos/blob/master/site/components/datepicker.js)
* [Viewpicker](https://github.com/googleanalytics/embed-api-demos/blob/master/site/components/viewpicker.js)
* [Active Users](https://github.com/googleanalytics/embed-api-demos/blob/master/site/components/active-users.js)

## Running the Demos Yourself

To run the demos yourself, all you have to do is download the repo, navigate to the site folder, and start up a local server. Here's a really easy way:

```sh
# Clone the repo and cd into the site directory.
git clone git@github.com:googleanalytics/embed-api-demos.git
cd embed-api-demos/site/

# Start running a local server at http://localhost:4000
python -m SimpleHTTPServer 4000
```

Now just go to [http://localhost:4000](http://localhost:4000) in your browser and you should see the site.

Alternatively you can copy and paste the files manually or use FTP to transfer them to a remote server, though if you do that you'll have to [change the client ID](https://developers.google.com/analytics/devguides/reporting/embed/v1/devguide#client-id) to one with your site's domain set as an approved origin.

**Note:** if you copy the files into a folder that is not at the root of your server, most of the links will not work and the page will probably look broken.

### Building the site using Jekyll

If you're familiar with [Jekyll](http://jekyllrb.com) it can make running the demos locally or deploying them to a remote server much easier. It's actually how this repo is built and how the demo app is deployed.

```sh
# Clone the repo and cd into the repo directory.
git clone git@github.com:googleanalytics/embed-api-demos.git
cd embed-api-demos

# Run the site locally using Jekyll
jekyll serve
```

The `jekyll serve` command will build all the files and load up a server on your local machine. Then you can go to [http://localhost:4000](http://localhost:4000) and everything should work fine. If you run `jekyll serve -w` it will also watch for changes to your source files and rebuild the site on the fly. This makes it easy to change a few things and see the results immediately.

If you need to change any of the configuration settings (like your client ID) you can set them in the [_config.yml](https://github.com/googleanalytics/embed-api-demos/blob/master/_config.yml) file and rerun the `jekyll serve` command.
