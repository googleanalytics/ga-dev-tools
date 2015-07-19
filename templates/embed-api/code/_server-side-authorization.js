gapi.analytics.ready(function() {

  /**
   * Authorize the user with an access token obtained server side.
   */
  gapi.analytics.auth.authorize({
    'serverAuth': {
      'access_token': 'XXXXXX'
    }
  });


  /**
   * Creates a new DataChart instance showing sessions over the past 30 days.
   * It will be rendered inside an element with the id "chart-1-container".
   */
  var dataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'ids': 'ga:42124519', // The Demos & Tools website view.
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'metrics': 'ga:sessions',
      'dimensions': 'ga:date'
    },
    chart: {
      'container': 'chart-1-container',
      'type': 'LINE',
      'options': {
        'width': '100%'
      }
    }
  });
  dataChart.execute();


  /**
   * Creates a new DataChart instance showing top countries.
   * It will be rendered inside an element with the id "chart-2-container".
   */
  var dataChart2 = new gapi.analytics.googleCharts.DataChart({
    query: {
      'ids': 'ga:42124519', // The Demos & Tools website view.
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'metrics': 'ga:sessions',
      'dimensions': 'ga:country',
      'sort': '-ga:sessions',
      'max-results': 5
    },
    chart: {
      'container': 'chart-2-container',
      'type': 'PIE',
      'options': {
        'width': '100%'
      }
    }
  });
  dataChart2.execute();


  /**
   * Creates a new DataChart instance showing top 5 most popular demos/tools.
   * It will be rendered inside an element with the id "chart-2-container".
   */
  var dataChart3 = new gapi.analytics.googleCharts.DataChart({
    query: {
      'ids': 'ga:42124519', // The Demos & Tools website view.
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'metrics': 'ga:pageviews',
      'dimensions': 'ga:pagePathLevel2',
      'sort': '-ga:pageviews',
      'max-results': 5
    },
    chart: {
      'container': 'chart-3-container',
      'type': 'TABLE',
      'options': {
        'width': '100%'
      }
    }
  });
  dataChart3.execute();


  /**
   * Creates a new DataChart instance showing top 5 most popular demos/tools
   * amongst returning users only.
   * It will be rendered inside an element with the id "chart-3-container".
   */
  var dataChart4 = new gapi.analytics.googleCharts.DataChart({
    query: {
      'ids': 'ga:42124519', // The Demos & Tools website view.
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'metrics': 'ga:pageviews',
      'dimensions': 'ga:pagePathLevel2',
      'sort': '-ga:pageviews',
      'segment': 'gaid::-3', // Returning users.
      'max-results': 5
    },
    chart: {
      'container': 'chart-4-container',
      'type': 'TABLE',
      'options': {
        'width': '100%'
      }
    }
  });
  dataChart4.execute();

});
