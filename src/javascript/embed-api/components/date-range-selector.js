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


/* global gapi */


/**
 * A DateRangeSelector component for the Embed API.
 */
gapi.analytics.ready(function() {
  let nDaysAgo = /(\d+)daysAgo/;
  let dateFormat = /\d{4}\-\d{2}\-\d{2}/;

  /**
   * Convert a date acceptable to the Core Reporting API (e.g. `today`,
   * `yesterday` or `NdaysAgo`) into the format YYYY-MM-DD. Dates
   * already in that format are simply returned.
   * @param {string} str The date string to format.
   * @return {string} The formatted date.
   */
  function convertDate(str) {
    // If str is in the proper format, do nothing.
    if (dateFormat.test(str)) return str;

    let match = nDaysAgo.exec(str);
    if (match) {
      return daysAgo(+match[1]);
    } else if (str == 'today') {
      return daysAgo(0);
    } else if (str == 'yesterday') {
      return daysAgo(1);
    } else {
      throw new Error('Cannot convert date ' + str);
    }
  }

  /**
   * Accept a number and return a date formatted as YYYY-MM-DD that
   * represents that many days ago.
   * @param {number} numDays The number of days ago whose date to return.
   * @return {string} The formatted date.
   */
  function daysAgo(numDays) {
    let date = new Date();
    date.setDate(date.getDate() - numDays);
    let month = String(date.getMonth() + 1);
    month = month.length == 1 ? '0' + month: month;
    let day = String(date.getDate());
    day = day.length == 1 ? '0' + day: day;
    return date.getFullYear() + '-' + month + '-' + day;
  }

  gapi.analytics.createComponent('DateRangeSelector', {

    /**
     * Initialize the DateRangeSelector instance and render it to the page.
     * @return {DateRangeSelector} The instance.
     */
    execute: function() {
      let options = this.get();
      options['start-date'] = options['start-date'] || '7daysAgo';
      options['end-date'] = options['end-date'] || 'yesterday';

      // Allow container to be a string ID or an HTMLElement.
      this.container = typeof options.container == 'string' ?
        document.getElementById(options.container) : options.container;

      // Allow the template to be overridden.
      if (options.template) this.template = options.template;

      this.container.innerHTML = this.template;
      let dateInputs = this.container.querySelectorAll('input');

      this.startDateInput = dateInputs[0];
      this.startDateInput.value = convertDate(options['start-date']);
      this.endDateInput = dateInputs[1];
      this.endDateInput.value = convertDate(options['end-date']);

      this.setValues();
      this.setMinMax();

      this.container.onchange = this.onChange.bind(this);
      return this;
    },

    /**
     * Emit a change event based on the currently selected dates.
     * Pass an object containing the start date and end date.
     */
    onChange: function() {
      this.setValues();
      this.setMinMax();
      this.emit('change', {
        'start-date': this['start-date'],
        'end-date': this['end-date'],
      });
    },

    /**
     * Updates the instance properties based on the input values.
     */
    setValues: function() {
      this['start-date'] = this.startDateInput.value;
      this['end-date'] = this.endDateInput.value;
    },

    /**
     * Updates the input min and max attributes so there's no overlap.
     */
    setMinMax: function() {
      this.startDateInput.max = this.endDateInput.value;
      this.endDateInput.min = this.startDateInput.value;
    },

    /**
     * The html structure used to build the component. Developers can
     * override this by passing it to the component constructor.
     * The only requirement is that the structure contain two inputs, the
     * first will be the start date and the second will be the end date.
     */
    template:
      '<div class="DateRangeSelector">' +
      '  <div class="DateRangeSelector-item">' +
      '    <label>Start Date</label> ' +
      '    <input type="date">' +
      '  </div>' +
      '  <div class="DateRangeSelector-item">' +
      '    <label>End Date</label> ' +
      '    <input type="date">' +
      '  </div>' +
      '</div>',
  });
});
