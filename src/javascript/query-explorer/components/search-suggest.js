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
import find from 'lodash/collection/find';
import pluck from 'lodash/collection/pluck';
import React from 'react';


const keyCodes = {
  ENTER: 13,
  TAB: 9,
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  ESC: 27,
}


// TODO(philipwalton):
// - Only allow 1 segment.
// - Add SearchSuggest to the "sort" option.
// - handle the "no results found" case with input border radius weirdness.
// - Remove legacy "XX" stuff.

export default class SearchSuggest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      matches: this.findMatches(props.value),
      selectedMatchIndex: 0,
      showMatches: false
    };
  }

  componentDidMount() {
    $(document).on(`click.SearchSuggest:${this.props.name}`, (e) => {
      if (this.state.showMatches == true &&
          !$.contains(React.findDOMNode(this), e.target)) {
        this.setHideMatchesState();
      }
    })
  }

  componentWillUnmount() {
    $(document).off(`.SearchSuggest:${this.props.name}`);
  }

  componentWillReceiveProps(props) {
    if (props.value != this.state.value) {
      this.setState({value: props.value});
    }
  }

  componentDidUpdate() {
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
  }

  handleChange(e) {
    let newState = {
      value: e.target.value,
      matches: this.findMatches(e.target.value),
      showMatches: true
    }

    if (this.state.selectedMatchIndex > newState.matches.length - 1) {
      newState.selectedMatchIndex = 0;
    }

    this.setState(newState);
    this.props.onChange.call(this, e);
  }

  handleKeyDown(e) {
    let selectedMatchIndex = this.state.selectedMatchIndex;
    let selectedMatch = this.state.matches[selectedMatchIndex];
    let totalMatches = this.state.matches.length;

    switch (e.keyCode) {
      case keyCodes.DOWN_ARROW:
        if (!this.state.showMatches) {
          this.setShowMatchesState();
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
        if (this.state.showMatches) {
          this.setSelectedMatchState(selectedMatch.id);
        }
        else {
          this.setShowMatchesState();
        }
        e.preventDefault();
        break;
      case keyCodes.TAB:
      case keyCodes.ESC:
        this.setHideMatchesState();
        break;
    }
  }

  handleMouseEnter(index) {
    this.setState({selectedMatchIndex: index});
  }

  setShowMatchesState() {
    let {value, search} = this.parseValue(this.state.value);

    // If search currently matches a known option, add a comma and assume the
    // user is trying to select another option.
    if (find(this.props.options, (option) => matches(option.id, search))) {
      value = value + ',';
    }

    this.setState({
      value: value,
      matches: this.findMatches(value),
      showMatches: true
    });
  }

  setHideMatchesState() {
    // Remove a trailing comma or whitespace.
    let value = this.state.value.replace(/[,\s]+$/, '');

    this.setState({
      value: value,
      showMatches: false,
      selectedMatchIndex: 0
    });

    this.props.onChange.call(this, {target:{value, name: this.props.name}});
  }

  setSelectedMatchState(choice) {
    let {parts, search} = this.parseValue(this.state.value);

    // If the entered value (search) matches the choice, just keep it and
    // assume that's what the user wanted.
    if (matches(choice, search)) choice = search;

    // Set the last part to the ID of the chosen option, overwriting whatever
    // is currently there.
    parts[parts.length - 1] = choice;

    let value = parts.join(',');

    this.setState({
      value: value,
      selectedMatchIndex: 0,
      showMatches: false
    });

    this.props.onChange.call(this, {target:{value, name: this.props.name}});
  }

  findMatches(value) {
    let {parts, search} = this.parseValue(value);
    let options = this.props.options;

    // If there is more than one part to the value, remove options that
    // match the existing parts.
    if (parts.length > 1) {
      let chosenParts = parts.slice(0, -1);
      options = filter(options, (option) => !chosenParts.includes(option.id));
    }

    // An empty string matches all options.
    if (!search) return options;

    return filter(options, function(option) {
      for (let key in option) {
        if (includes(option[key], search)) return true;
      }
    });
  }

  parseValue(value) {
    let parts = value.split(',');
    let search = parts[parts.length - 1];
    return {value, parts, search};
  }

  render() {

    let className = 'SearchSuggest';
    if (this.state.showMatches) className += ' SearchSuggest--open';

    return (
      <div className={className}>
        <input
          className="SearchSuggest-field FormField"
          name={this.props.name}
          value={this.state.value}
          onFocus={this.setShowMatchesState.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          ref="input" />
        <ul className="SearchSuggest-matches" ref="matches">
          {this.state.matches.map((match, index) => {
            let className = 'SearchSuggestMatch';
            if (this.state.selectedMatchIndex == index) {
              className += ' SearchSuggestMatch--selected';
            }
            return (
              <li
                className={className}
                onMouseEnter={this.handleMouseEnter.bind(this, index)}
                onClick={this.setSelectedMatchState.bind(this, match.id)}
                ref={match.id}
                key={match.id}>
                <span className="SearchSuggestMatch-category">
                  {match.group}
                </span>
                <div className="SearchSuggestMatch-content">
                  {match.name}
                </div>
                <div className="SearchSuggestMatch-extra">
                  {match.id}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}


SearchSuggest.defaultProps = {
  value: '',
  options: []
};


// Match against the lowercase version and replace all 1-2 digit number
// values with "XX" to match things like ga:dimensionXX.
function matches(choice, search) {
  return search.replace(/\d{1,2}/, 'XX').toLowerCase() == choice.toLowerCase();
}

// Match against the lowercase version and replace all 1-2 digit number
// values with "XX" to match things like ga:dimensionXX.
function includes(choice, search) {
  return choice.toLowerCase()
      .includes(search.replace(/\d{1,2}/, 'XX').toLowerCase());
}
