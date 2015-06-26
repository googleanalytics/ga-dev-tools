gapi.analytics.ready(function() {

  /**
   * Authorize the user immediately if the user has already granted access.
   * If no access has been created, render an authorize button inside the
   * element with the ID "embed-api-auth-container".
   */
  gapi.analytics.auth.authorize({
    container: 'embed-api-auth-container',
    clientid: 'REPLACE WITH YOUR CLIENT ID'
  });


  /**
   * Create a new ViewSelector instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ViewSelector({
    container: 'view-selector-container'
  });

  // Render the view selector to the page.
  viewSelector.execute();


  /**
   * Create a new DataChart instance for pageviews over the past 7 days.
   * It will be rendered inside an element with the id "chart-1-container".
   */
  var dataChart1 = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:pageviews',
      dimensions: 'ga:date',
      'start-date': '7daysAgo',
      'end-date': 'yesterday'
    },
    chart: {
      container: 'chart-1-container',
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  });


  /**
   * Create a new DataChart instance for pageviews over the 7 days prior
   * to the past 7 days.
   * It will be rendered inside an element with the id "chart-2-container".
   */
  var dataChart2 = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:pageviews',
      dimensions: 'ga:date',
      'start-date': '15daysAgo',
      'end-date': '8daysAgo'
    },
    chart: {
      container: 'chart-2-container',
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  });


  /**
   * Render both dataCharts on the page whenever a new view is selected.
   */
  viewSelector.on('change', function(ids) {
    dataChart1.set({query: {ids: ids}}).execute();
    dataChart2.set({query: {ids: ids}}).execute();
  });

});