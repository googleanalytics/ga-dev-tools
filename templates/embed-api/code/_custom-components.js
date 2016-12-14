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
   * Store a set of common DataChart config options since they're shared by
   * both of the charts we're about to make.
   */
  var commonConfig = {
    query: {
      metrics: 'ga:sessions',
      dimensions: 'ga:date'
    },
    chart: {
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  };


  /**
   * Query params representing the first chart's date range.
   */
  var dateRange1 = {
    'start-date': '14daysAgo',
    'end-date': '8daysAgo'
  };


  /**
   * Query params representing the second chart's date range.
   */
  var dateRange2 = {
    'start-date': '7daysAgo',
    'end-date': 'yesterday'
  };


  /**
   * Create a new ViewSelector2 instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ext.ViewSelector2({
    container: 'view-selector-container',
  }).execute();


  /**
   * Create a new DateRangeSelector instance to be rendered inside of an
   * element with the id "date-range-selector-1-container", set its date range
   * and then render it to the page.
   */
  var dateRangeSelector1 = new gapi.analytics.ext.DateRangeSelector({
    container: 'date-range-selector-1-container'
  })
  .set(dateRange1)
  .execute();


  /**
   * Create a new DateRangeSelector instance to be rendered inside of an
   * element with the id "date-range-selector-2-container", set its date range
   * and then render it to the page.
   */
  var dateRangeSelector2 = new gapi.analytics.ext.DateRangeSelector({
    container: 'date-range-selector-2-container'
  })
  .set(dateRange2)
  .execute();


  /**
   * Create a new DataChart instance with the given query parameters
   * and Google chart options. It will be rendered inside an element
   * with the id "data-chart-1-container".
   */
  var dataChart1 = new gapi.analytics.googleCharts.DataChart(commonConfig)
      .set({query: dateRange1})
      .set({chart: {container: 'data-chart-1-container'}});


  /**
   * Create a new DataChart instance with the given query parameters
   * and Google chart options. It will be rendered inside an element
   * with the id "data-chart-2-container".
   */
  var dataChart2 = new gapi.analytics.googleCharts.DataChart(commonConfig)
      .set({query: dateRange2})
      .set({chart: {container: 'data-chart-2-container'}});


  /**
   * Register a handler to run whenever the user changes the view.
   * The handler will update both dataCharts as well as updating the title
   * of the dashboard.
   */
  viewSelector.on('viewChange', function(data) {
    dataChart1.set({query: {ids: data.ids}}).execute();
    dataChart2.set({query: {ids: data.ids}}).execute();

    var title = document.getElementById('view-name');
    title.textContent = data.property.name + ' (' + data.view.name + ')';
  });


  /**
   * Register a handler to run whenever the user changes the date range from
   * the first datepicker. The handler will update the first dataChart
   * instance as well as change the dashboard subtitle to reflect the range.
   */
  dateRangeSelector1.on('change', function(data) {
    dataChart1.set({query: data}).execute();

    // Update the "from" dates text.
    var datefield = document.getElementById('from-dates');
    datefield.textContent = data['start-date'] + '&mdash;' + data['end-date'];
  });


  /**
   * Register a handler to run whenever the user changes the date range from
   * the second datepicker. The handler will update the second dataChart
   * instance as well as change the dashboard subtitle to reflect the range.
   */
  dateRangeSelector2.on('change', function(data) {
    dataChart2.set({query: data}).execute();

    // Update the "to" dates text.
    var datefield = document.getElementById('to-dates');
    datefield.textContent = data['start-date'] + '&mdash;' + data['end-date'];
  });

});
