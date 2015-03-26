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


import React from 'react';


let iconCalendar =
    `<svg class="Icon" viewBox="0 0 16 16">
       <use xlink:href="/public/images/icons.svg#icon-calendar"></use>
     </svg>`;


var Datepicker = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.value,
    }
  },
  handleChange: function(e) {
    this.setState({value: e.target.value});
    this.props.onChange.call(this, e);
  },
  componentDidMount: function() {
    let isShowing = false;
    let opts = {
      changeMonth: true,
      changeYear: true,
      constrainInput: false,
      dateFormat: 'yy-mm-dd',
      showOn: false,
      onClose: function() {
        // Use setTimeout to avoid race conditions with the icon click event.
        setTimeout(function() {
          isShowing = false
        }, 0);
      }
    };

    let self = this;
    let $input = $(this.refs.input.getDOMNode());
    let $icon = $(this.refs.icon.getDOMNode());

    $input.datepicker(opts).on('change', function(e) {
      self.handleChange(e)
      self.props.onChange(e)
    });

    $icon.on('click', function(e) {
      $input.datepicker(isShowing ? 'hide' : 'show');
      isShowing = !isShowing;
    });

  },
  componentWillUnmount: function() {
    $(this.refs.input.getDOMNode()).datepicker('destroy').off();
  },
  render: function() {
    return (
      <div className="FormFieldAddOn">
        <input
          ref="input"
          className="FormField FormFieldAddOn-field"
          name={this.props.name}
          value={this.state.value}
          onChange={this.handleChange}
          placeholder={this.props.placeholder} />
        <button
          ref="icon"
          type="button"
          className="FormFieldAddOn-item"
          onClick={this.handleIconClick}
          tabIndex="-1"
          dangerouslySetInnerHTML={{__html: iconCalendar}} />
      </div>
    );
  }
});


export default Datepicker
