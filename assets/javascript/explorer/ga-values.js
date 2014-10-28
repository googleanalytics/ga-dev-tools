// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


//namespace for the Explorer
var explorer = explorer || {};


/**
 * Google Analytics Service Name.
 */
explorer.SERVICE_NAME = 'query_explorer_v2.0';


/**
 * Core Reporting API endpoint.
 */
explorer.CORE_REPORTING_API = 'https://www.googleapis.com/analytics/v3/data/ga';


/**
 * Custom Segment name.
 */
explorer.customSegName = 'Custom Segments';


/**
 * Custom Segment UI labels.
 */
explorer.customSegVals = [
  'Authorize to access your segments',
  'Click to list your segments'
];


/**
 * The URL to the core reporting api reference docs.
 */
explorer.coreapiRefUrl = '//developers.google.com/analytics/devguides/reporting/' +
    'core/v3/reference';


/**
 * The URL to the core reporting dimensions & metrics list.
 */
explorer.DIMS_METS_URL = '//developers.google.com/analytics/devguides/reporting/' +
    'core/dimsmets';


/**
 * This object holds all the definitions of the parameters in the query object
 */
explorer.queryConfig = {
  'ids': {
    'size': 125,
    'req': true,
    'help': 'The namespaced view (profile) ID of the view (profile) from ' +
        'which to request data. Use the view (profile) selector above ' +
        'to find this value.',
    'example': 'ga:1174 where 1174 is your view (profile) ID.',
    'anchor': '#ids'},
  'dimensions': {
    'size': 365,
    'req': false,
    'help': 'The dimension data to be retrieved from the API. A single ' +
        'request is limited to a maximum of 7 dimensions.',
    'example': 'ga:source',
    'anchor': '#dimensions'},
  'metrics': {
    'size': 365,
    'req': true,
    'help': 'The metrics data to be retrieved from the API. A single ' +
        'request is limited to a maximum of 10 metrics.',
    'example': 'ga:visits',
    'anchor': '#metrics'},
  'segment': {
    'size': 365,
    'req': false,
    'help': 'Specifies a subset of visits based on either an expression or a ' +
        'filter. The subset of visits matched happens before dimensions ' +
        'and metrics are calculated.',
    'example': 'Dynamic: <em>segment=</em>dynamic::ga:source=~twitter<br/>By ' +
        'ID: <em>segment=</em>gaid::-3',
    'anchor': '#segment'},
  'filters': {
    'size': 325,
    'req': false,
    'help': 'Specifies a subset of all data matched in analytics. This tool ' +
        'automatically URI encodes the parameter.',
    'example': 'Equals: <em>filters=</em>ga:country==Canada<br/>Regular ' +
        'Expression: <em>filters=</em>ga:city=~^New.*',
    'anchor': '#filters'},
  'sort': {
    'size': 325,
    'req': false,
    'help': 'The order and direction to retrieve the results. Can have ' +
        'multiple dimensions and metrics.',
    'example': 'Ascending: ga:visits<br/>Descending: -ga:visits',
    'anchor': '#sort'},
  'start-date': {
    'size': 125,
    'req': true,
    'help': 'Beginning date to retrieve data in format YYYY-MM-DD.',
    'example': '2009-04-20',
    'anchor': '#startDate'},
  'end-date': {
    'size': 125,
    'req': true,
    'help': 'Final date to retrieve data in format YYYY-MM-DD.',
    'example': '2009-04-21',
    'anchor': '#endDate'},
  'start-index': {
    'size': 125,
    'req': false,
    'help': 'Use this parameter to request more rows from the API. For ' +
        'example if your query matches 100,000 rows, the API will only ' +
        'return a subset of them and you can use this parameter to ' +
        'request different subsets. The index starts from 1 and the ' +
        'default is 1.',
    'example': '50001',
    'anchor': '#startIndex'},
  'max-results': {
    'size': 125,
    'req': false,
    'help': 'Maximum number of results to retrieve from the API. The ' +
        'default is 1,000 but can be set up to 10,000.',
    'example': '500',
    'anchor': '#maxResults'}
};


/**
 * An Object to hold pre canned queries
 */
explorer.cannedQueries = {
  'Visits and pageviews over time': {
    'dimensions': 'ga:date',
    'metrics': 'ga:visits,ga:pageviews',
    'sort': '',
    'filters': ''},
  'Visits by traffic source': {
    'dimensions': 'ga:source,ga:medium',
    'metrics': 'ga:visits',
    'sort': '-ga:visits',
    'filters': ''},
  'Visits by browser (including mobile phones)': {
    'dimensions': 'ga:browser',
    'metrics': 'ga:visits',
    'sort': '-ga:visits',
    'filters': ''},
  'Language by country': {
    'dimensions': 'ga:language,ga:country',
    'metrics': 'ga:visits',
    'sort': '-ga:visits',
    'filters': ''},
  'Top pages by pageviews': {
    'dimensions': 'ga:pagePath,ga:pageTitle',
    'metrics': 'ga:pageviews',
    'sort': '-ga:pageviews',
    'filters': ''},
  'Top search refinements': {
    'dimensions': 'ga:searchKeyword,ga:searchKeywordRefinement,' +
        'ga:searchDestinationPage',
    'metrics': 'ga:searchRefinements',
    'sort': '-ga:searchRefinements',
    'filters': ''},
  'First 3 days of data in view (profile)': {
    'dimensions': 'ga:date',
    'metrics': 'ga:visits',
    'sort': 'ga:date',
    'filters': 'ga:visits>1',
    'start-date': '2005-01-01',
    'max-results': '3'}
};


/**
 * Object to hold all segents drop down help data.
 */
explorer.segmentsHelp = {
  'Dynamic Segments': {
    'help': 'Allows the creation of segments on the fly.',
    'values': {
      'Write your own Segment': 'dynamic::'
    }
  },
  'Custom Segments': {
    'help': 'Custom segments are built through the Google Analytics user ' +
        'interface and may be referenced through the API by ID. All ' +
        'Custom segment IDs are positive. Custom segments are also ' +
        'defined per user meaning each authorized user may have a ' +
        'different set of Custom Segments.',
    'values': {
      'Authorize to access your own segments': ''
      // Dynamically added based on auth status or if account data has been
      // retrieved. See Explorer.displayLogin, Explorer.displayLogout,
      // explorer.SegmentsDropdownUpdateValues for details.
    }
  },
  'Default Segments': {
    'help': 'Default segments are pre-built and defined for all users. ' +
        'Default segment IDs are negative.',
    'values': {
      'All Visits': 'gaid::-1',
      'New Visitors': 'gaid::-2',
      'Returning Visitors': 'gaid::-3',
      'Paid Search Traffic': 'gaid::-4',
      'Non-paid Search Traffic': 'gaid::-5',
      'Search Traffic': 'gaid::-6',
      'Direct Traffic': 'gaid::-7',
      'Referral Traffic': 'gaid::-8',
      'Visits with Conversions': 'gaid::-9',
      'Visits with Transactions': 'gaid::-10',
      'Mobile and Tablet Traffic': 'gaid::-11',
      'Non-bounce Visits': 'gaid::-12',
      'Tablet traffic': 'gaid::-13',
      'Mobile Traffic': 'gaid::-14'
    }
  }
};
