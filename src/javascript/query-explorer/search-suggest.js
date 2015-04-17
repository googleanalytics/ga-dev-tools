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


import filter from 'lodash/collection/filter';
import pluck from 'lodash/collection/pluck';
import React from 'react';


const keyCodes = {
  ENTER: 13,
  TAB: 9,
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  ESC: 27,
}


function findMatches(value, options) {
  // An empty string matches all options.
  if (!value) return options

  // Match against the last portion of a comma-separated string.
  let parts = value.split(',');
  let str = parts[parts.length - 1].toLowerCase();

  return filter(options, function(option) {
    for (let key in option) {
      if (option[key].toLowerCase().indexOf(str) > -1) return true;
    }
  });
}


let SearchSuggest = React.createClass({

  getInitialState: function() {
    return {
      value: this.props.value || '',
      options: this.props.options || [],
      matches: this.props.options || [],
      selectedMatchIndex: 0,
      showMatches: false
    }
  },

  componentDidMount: function() {
    $(document).on(`click.SearchSuggest:${this.props.name}`, (e) => {
      if (!$.contains(this.getDOMNode(), e.target)) {
        this.handleFocusOut();
      }
    })
  },

  componentWillUnmount: function() {
    $(document).off(`.SearchSuggest:${this.props.name}`);
  },

  componentWillReceiveProps: function(props) {
    if (props.options != this.state.options) {
      this.setState({
        options: props.options,
        matches: findMatches(props.value, props.options)
      });
    }
  },

  componentDidUpdate: function() {
    let matches = this.state.matches;
    let selectedMatchIndex = this.state.selectedMatchIndex;
    let selectedMatch = matches[selectedMatchIndex];

    // If there is no selected match, return immediately.
    if (!(selectedMatch && this.refs[selectedMatch.id])) return;

    let container = this.refs.matches.getDOMNode();
    let containerScrollTop = container.scrollTop;
    let containerScrollHeight = container.scrollHeight;
    let containerClientHeight = container.clientHeight;

    let selectedMatchElement = this.refs[selectedMatch.id].getDOMNode();
    let selectedMatchElementOffsetTop = selectedMatchElement.offsetTop;
    let selectedMatchElementClientHeight = selectedMatchElement.clientHeight;

    // If the select match element is below the visible part of the container.
    if (selectedMatchElementOffsetTop + selectedMatchElementClientHeight >
        containerScrollTop + containerClientHeight) {

      container.scrollTop = selectedMatchElementOffsetTop +
          selectedMatchElementClientHeight - containerClientHeight;
    }
    // If the select match element is above the visible part of the container.
    else if (selectedMatchElementOffsetTop < containerScrollTop) {
      container.scrollTop = selectedMatchElementOffsetTop;
    }
  },

  handleChange: function(e) {
    this.props.onChange.call(this, e);

    let value = e.target.value;
    let matches = findMatches(value, this.state.options);
    this.setState({value, matches, showMatches: true});
  },

  handleFocus: function(e) {
    this.setState({showMatches: true});
  },

  handleFocusOut: function(e) {
    // Remove a trailing comma or whitespace.
    let value = this.state.value.replace(/,\s*$/, '');

    this.setState({
      value: value,
      showMatches: false,
      selectedMatchIndex: 0
    });
  },

  handleKeyDown: function(e) {
    let selectedMatchIndex = this.state.selectedMatchIndex;
    let selectedMatch = this.state.matches[selectedMatchIndex];
    let totalMatches = this.state.matches.length;

    switch (e.keyCode) {
      case keyCodes.DOWN_ARROW:
        if (!this.state.showMatches) {
          this.setState({showMatches: true});
        }
        else if (selectedMatchIndex < totalMatches - 1) {
          this.setState({selectedMatchIndex:  selectedMatchIndex + 1});
        }
        e.preventDefault();
        break;
      case keyCodes.UP_ARROW:
        if (selectedMatchIndex > 0) {
          this.setState({selectedMatchIndex: selectedMatchIndex - 1});
        }
        e.preventDefault();
        break;
      case keyCodes.ENTER:
        this.selectMatch(selectedMatch.id);
        e.preventDefault();
        break;
      case keyCodes.TAB:
      case keyCodes.ESC:
        this.handleFocusOut();
        break;
    }
  },

  handleMouseEnter: function(index) {
    this.setState({selectedMatchIndex: index});
  },

  selectMatch: function(id) {
    let value = this.state.value;
    let parts = value.split(',');
    parts[parts.length - 1] = id;

    this.setState({
      value: parts.join(','),
      selectedMatchIndex: 0,
      showMatches: false
    });
  },

  render: function() {

    let className = 'SearchSuggest';
    if (this.state.showMatches) className += ' SearchSuggest--open';

    let matches = this.state.showMatches && (
      <ul className="SearchSuggest-matches" ref="matches">
        {this.state.matches.map((option, index) => {
          let className = 'SearchSuggestMatch';
          if (this.state.selectedMatchIndex == index) {
            className += ' SearchSuggestMatch--selected';
          }
          return (
            <li
              className={className}
              onMouseEnter={this.handleMouseEnter.bind(this, index)}
              onClick={this.selectMatch.bind(this, option.id)}
              ref={option.id}
              key={option.id}>
              <span className="SearchSuggestMatch-category">
                {option.group}
              </span>
              <div className="SearchSuggestMatch-content">
                {option.name}
              </div>
              <div className="SearchSuggestMatch-extra">
                {option.id}
              </div>
            </li>
          )
        })}
      </ul>
    );

    return (
      <div className={className}>
        <input
          className="SearchSuggest-field FormField"
          name={this.props.name}
          value={this.state.value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          ref="input" />
        {matches}
      </div>
    );
  }
});


export default SearchSuggest;
