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


/* global $ */


import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';
import template from 'lodash/string/template';


/**
 * The template to render the select2 tag items within the input field.
 */
let s2TagTemplate = template('<span title="<%- name %>"><%- id %></span>');


/**
 * The template to render the choices within the select2 dropdown.
 */
let s2DropdownItemTemplate = template(
    '<div class="S2Tag">' +
    '  <% if (name) { %>' +
    '    <span class="S2Tag-category"><%- group %></span>' +
    '    <div class="S2Tag-content"><%- name %></div>' +
    '    <div class="S2Tag-extra"><%- id %></div>' +
    '  <% } else { %>' +
    '    <div class="S2Tag-content"><%- id %></div>' +
    '  <% } %>' +
    '</div>');


let baseOpts = {
  formatSelection: s2TagTemplate,
  formatResult: s2DropdownItemTemplate,
};


let segmentsOpts = {
  // You can't specify no separator, so we have to
  // choose a character unlikely to appear.
  separator: '&&&',
  tokenSeparator: '&&&',

  maximumSelectionSize: 1,
  formatSelectionTooBig: 'Only one segment allowed per query',
  initSelection: function(element, callback) {
    let segments = element.data('select2').opts.tags;
    let value = element.val();
    let segment = find(segments, segment =>
        value == segment.segmentId || value == segment.definition);

    callback(segment ? [segment] : [{id: value, text: value}]);
  }
};


function getOptsFromProps(props) {
  return props.name == 'segment'
    ? assign({tags: props.tags}, baseOpts, segmentsOpts)
    : assign({tags: props.tags}, baseOpts);
}

export default {
  componentDidMount: function() {
    if (this.props.tags) {
      $(this.refs.input.getDOMNode())
          .select2(getOptsFromProps(this.props))
          .on('change', this.props.onChange);
    }
  },
  componentWillReceiveProps: function(props) {
    if (props.tags != this.props.tags) {
      $(this.refs.input.getDOMNode()).select2(getOptsFromProps(props));
    }
  },
  componentWillUnmount: function() {
    if (this.props.tags) {
      $(this.refs.input.getDOMNode()).select2('destroy').off();
    }
  }
};
