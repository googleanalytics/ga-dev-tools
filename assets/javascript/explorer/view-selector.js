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


import React from 'react';


/**
 * To fit the style of the page, customize the view selector template.
 */
const VIEW_SELECTOR_TEMPLATE =
    '<div class="FormControl FormControl--inline">' +
    '  <label class="FormControl-label">Account</label>' +
    '  <div class="FormControl-body">' +
    '    <select class="FormField"></select>' +
    '  </div>' +
    '</div>' +
    '<div class="FormControl FormControl--inline">' +
    '  <label class="FormControl-label">Property</label>' +
    '  <div class="FormControl-body">' +
    '    <select class="FormField"></select>' +
    '  </div>' +
    '</div>' +
    '<div class="FormControl FormControl--inline">' +
    '  <label class="FormControl-label">View</label>' +
    '  <div class="FormControl-body">' +
    '    <select class="FormField"></select>' +
    '  </div>' +
    '</div>';


var ViewSelector = React.createClass({
  componentDidMount: function() {

    let self = this;

    gapi.analytics.ready(function() {

      self.viewSelector_ = new gapi.analytics.ext.ViewSelector2({
        container: self.getDOMNode(),
        ids: self.props.ids,
        template: self.props.template || VIEW_SELECTOR_TEMPLATE
      })

      self.viewSelector_.on('viewChange', function(...args) {
        self.hasSuccessfullyShownView_ = true;
        self.props.onChange.apply(self, args)
      });

      // An error on the first render means somehow a view was passed
      // to the constructor to which the user doesn't have access.
      // In that case, render the default view. All other errors should
      // just do nothing.
      self.viewSelector_.on('error', function() {
        if (!self.hasSuccessfullyShownView_) {
          self.viewSelector_.set({ids:undefined}).execute();
        }
      });

      self.viewSelector_.execute();
    });
  },
  componentWillReceiveProps: function(props) {
    if (props.ids && this.viewSelector_) {
      this.viewSelector_.set({ids: props.ids}).execute();
    }
  },
  componentWillUnmount: function() {
    if (this.viewSelector_) this.viewSelector_.off();
  },
  render: function() {
    return (
      <div dangerouslySetInnerHTML={{__html: VIEW_SELECTOR_TEMPLATE}} />
    );
  }
});

export default ViewSelector
