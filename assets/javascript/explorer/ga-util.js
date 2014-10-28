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


/* global google */

// Namespaces.
var explorer = explorer || {};

/**
 * Config object for util.
 */
explorer.util = explorer.util || {};


/**
 * Creates a DataTable object using a GA responseonse.
 * @param {Object} results A Core Reporting API response.
 * @return {Object} A Google DataTable object populated
 *     with the GA response data.
 */
explorer.util.getDataTableFromCoreApi = function(results) {

  var dataTable = new google.visualization.DataTable();

  if (!(results.rows && results.rows.length)) {
    dataTable.addColumn('string', '(none)');
    dataTable.addRows(1);
    dataTable.setCell(0, 0, 'no results found');
    return dataTable;
  }

  explorer.util.addColumns(dataTable, results);
  explorer.util.addRows(dataTable, results);
  explorer.util.addDateFormatter(dataTable, results);
  return dataTable;
};

/**
 * Looks at the response column headers to set names and types for each column.
 * @param {Object} dataTable A Google DataTable.
 * @param {Object} results A Core Reporting API response.
 */
explorer.util.addColumns = function(dataTable, results) {
  for (var i = 0, header; header = results.columnHeaders[i]; ++i) {
    var dataType;

    if (header.name == 'ga:date') {
      dataType = 'date';
    } else if (header.columnType == 'DIMENSION') {
      dataType = 'string';
    } else {
      dataType = 'number';
    }
    dataTable.addColumn(dataType, header.name);
  }
};


/**
 * Looks at the row values and performs conversions before setting output cells.
 * @param {Object} dataTable A Google DataTable.
 * @param {Object} results A Core Reporting API response.
 */
explorer.util.addRows = function(dataTable, results) {
  dataTable.addRows(results.rows.length);

  for (var i = 0, row; row = results.rows[i]; ++i) {
    for (var j = 0, cellValue; cellValue = row[j]; ++j) {

      var header = results.columnHeaders[j];
      var tableValue = cellValue;
      var dataType = header.dataType;

      // Perform conversions if necessary.
      if (header.name == 'ga:date') {
        tableValue = explorer.util.getDateObj(cellValue);

      } else if (dataType == 'INTEGER') {
        tableValue = parseInt(cellValue, 10);

      } else if (dataType == 'CURRENCY') {
        tableValue = parseFloat(cellValue);

      } else if (dataType == 'PERCENT' || dataType == 'TIME' ||
          dataType == 'FLOAT') {
        tableValue = Math.round(cellValue * 100) / 100;
      }

      dataTable.setCell(i, j, tableValue);
    }
  }
};


/**
 * Formats date values.
 * @param {Object} dataTable A Google DataTable.
 * @param {Object} results A Core Reporting API response.
 */
explorer.util.addDateFormatter = function(dataTable, results) {
  var dateFormatter = new google.visualization.DateFormat({
    pattern: 'MM-dd-yyyy'
  });

  for (var i = 0, header; header = results.columnHeaders[i]; ++i) {
    if (header.name == 'ga:date') {
      dateFormatter.format(dataTable, i);
    }
  }
};


/**
 * Transforms the date string passed back from the GA API into a JavaScript
 * Date object.
 * @param {string} gaDate A date string passed back by the GA API.
 * @return {Date} a JS Date Object representing the string passde to this
 *     method.
 */
explorer.util.getDateObj = function(gaDate) {
  var date = new Date();
  var year = parseInt(gaDate.substring(0, 4), 10);
  var month = parseInt(gaDate.substring(4, 6), 10) - 1;
  var day = parseInt(gaDate.substring(6, 8), 10);
  date.setFullYear(year);
  date.setMonth(month, day);
  return date;
};


/**
 * Binds a method to it's object.
 * @param {Object} object The main object to bind to.
 * @param {Object} method The method to bind to the object.
 * @return {Function} the function passed in boound to the object parameter.
 */
explorer.util.bindMethod = function(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
};


/**
 * HTML escapes the input string by converting the &, <, > and " characters
 * to their HTML escaped version. Taken from the code in the closure string
 * library.
 * @param {String} str The string to convert.
 * @return {String} The escaped string.
 */
explorer.util.htmlEscape = function(str) {
  var allRe = /[&<>\"]/;
  if (!allRe.test(str)) {
    return str;
  }

  if (str.indexOf('&') != -1) {
    str = str.replace(/&/g, '&amp;');
  }
  if (str.indexOf('<') != -1) {
    str = str.replace(/</g, '&lt;');
  }
  if (str.indexOf('>') != -1) {
    str = str.replace(/>/g, '&gt;');
  }
  if (str.indexOf('"') != -1) {
    str = str.replace(/"/g, '&quot;');
  }
  return str;
};
