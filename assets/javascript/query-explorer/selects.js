// Copyright 2015 Google Inc. All rights reserved.
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

var find = require('lodash').find;
var metadata = require('javascript-api-utils/lib/metadata');
var template = require('lodash').template;


/**
 * The template to render the select2 tag items within the input field.
 */
var s2TagTemplate = template('<span title="<%- name %>"><%- id %></span>');


/**
 * The template to render the choices within the select2 dropdown.
 */
var s2DropdownItemTemplate = template(
    '<div class="S2Tag">' +
    '  <% if (name) { %>' +
    '    <span class="S2Tag-category"><%- group %></span>' +
    '    <div class="S2Tag-content"><%- name %></div>' +
    '    <div class="S2Tag-extra"><%- id %></div>' +
    '  <% } else { %>' +
    '    <div class="S2Tag-content"><%- id %></div>' +
    '  <% } %>' +
    '</div>');


/**
 * Converts the input#segment element into a select2 component.
 * Displays the segment id or definition based on the input#segment-toggle
 * checkbox.
 */
function renderSegmentSelects(response) {

  var $segment = $('#segment');
  var useDefinition = $('#segment-toggle').is(':checked');

  var segments = response.result.items.map(function(segment) {
    return {
      id: useDefinition ? segment.definition : segment.segmentId,
      text: [segment.definition, segment.name, segment.type].join(' '),
      definition: segment.definition,
      segmentId: segment.segmentId,
      name: segment.name,
      group: segment.type == 'BUILT_IN' ? 'Built in Segment' : 'Custom Segment',
    };
  });

  // Remove the 'All Sessions' segment when using definitions
  // because it doesn't have a definition.
  if (useDefinition) segments = segments.slice(1);

  $segment.select2({
    tags: segments,
    separator: ' ',
    maximumSelectionSize: 1,
    formatSelectionTooBig: 'Only one segment allowed per query',
    formatSelection: s2TagTemplate,
    formatResult: s2DropdownItemTemplate,
    initSelection: function(element, callback) {
      var text = element.val();
      var item = find(segments, function(segment) {
        return text == segment.segmentId || text == segment.definition;
      });
      element.val(item ? item.id : '');
      callback(item ? [item] : []);
    },
  });
}


/**
 * Converts the elements input#metrics and input#dimensions into select2
 * components.
 */
function renderDimensionsAndMetricsSelects(columns) {

  var metrics = columns.allMetrics('public').map(function(metric) {
    return {
      id: metric.id,
      text: [metric.id, metric.uiName, metric.group].join(' '),
      name: metric.attributes.uiName,
      group: metric.attributes.group
    };
  });

  var dimensions = columns.allDimensions('public').map(function(dimension) {
    return {
      id: dimension.id,
      text: [dimension.id, dimension.uiName, dimension.group].join(' '),
      name: dimension.attributes.uiName,
      group: dimension.attributes.group
    };
  });

  $('#metrics').select2({
    tags: metrics,
    formatSelection: s2TagTemplate,
    formatResult: s2DropdownItemTemplate,
  });

  $('#dimensions').select2({
    tags: dimensions,
    formatSelection: s2TagTemplate,
    formatResult: s2DropdownItemTemplate,
  });
}


module.exports = {

  /**
   * Initialize the metrics, dimensions, and segment select2 instances.
   * @return {Promise} A promise that is resolved when everything is done.
   */
  init: function() {

    var getMetadata = metadata.get();
    var listSegments = gapi.client.analytics.management.segments.list();

    getMetadata.then(renderDimensionsAndMetricsSelects);
    listSegments.then(renderSegmentSelects);

    $('#segment-toggle').on('click', function() {
      listSegments.then(renderSegmentSelects);
    });

    return Promise.all([getMetadata, listSegments]);
  }
};
