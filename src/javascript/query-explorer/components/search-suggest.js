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
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  UP_ARROW: 38,
  DOWN_ARROW: 40
};


export default class SearchSuggest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      matches: [],
      selectedMatchIndex: 0,
      open: false
    };
    // A unique namespace used to add jQuery events for just this instance.
    this.namespace = 'SearchSuggest:' + this.props.name;
  }

  componentDidMount() {
    this.setState({
      matches: this.findMatches(this.state.value)
    });

    // Select2 stops click event propagation, so we have to
    // listen to `click` as well as `select2-opening` events.
    let events = `click.${this.namespace} select2-opening.${this.namespace}`;
    $(document).on(events, (e) => {
      if (this.state.open == true &&
          !$.contains(React.findDOMNode(this), e.target)) {
        this.setHideMatchesState();
      }
    });
  }

  componentWillUnmount() {
    $(document).off(`.SearchSuggest:${this.props.name}`);
  }

  componentWillReceiveProps(props) {
    if (props.options != this.props.options) {
      let matches = this.findMatches(this.state.value, props.options);
      this.setState({matches});
    }
    if (props.value != this.state.value) {
      this.setState({value: props.value});
    }
  }

  componentDidUpdate(prevProps, prevState) {

    // If the update was triggered by a value change, make sure the dropdown
    // is always scrolled to the top so the first match is visible.
    if (this.state.value != prevState.value) {
      React.findDOMNode(this.refs.matches).scrollTop = 0;
    }

    // If the user is scrolling through the matches via the up and down arrows
    // keys, make sure the selected match is always in view.
    if (this.isKeyboardScrolling_) {

      // TODO(philipwalton): is there a more React-y way of getting access
      // to this node? Using refs seems like overkill...
      let selectedElement = React.findDOMNode(this.refs.matches)
          .children[this.state.selectedMatchIndex];

      // If there is no selected match, return immediately.
      if (!selectedElement) return;

      let selectedElementOffsetTop = selectedElement.offsetTop;
      let selectedElementClientHeight = selectedElement.clientHeight;
      let container = React.findDOMNode(this.refs.matches);
      let containerScrollTop = container.scrollTop;
      let containerClientHeight = container.clientHeight;

      // If the select match element is below the visible part of the container.
      if (selectedElementOffsetTop + selectedElementClientHeight >
          containerScrollTop + containerClientHeight) {

        container.scrollTop = selectedElementOffsetTop +
            selectedElementClientHeight - containerClientHeight;
      }
      // If the select match element is above the visible part of the container.
      else if (selectedElementOffsetTop < containerScrollTop) {
        container.scrollTop = selectedElementOffsetTop;
      }

      this.isKeyboardScrolling_ = false;
    }
  }

  handleChange(e) {
    let value = e.target.value;
    let name = this.props.name;

    this.setState({
      value: value,
      matches: this.findMatches(value),
      selectedMatchIndex: 0,
      open: true
    });
    this.props.onChange.call(this, {target: {name, value}});
  }

  handleKeyDown(e) {
    let selectedMatchIndex = this.state.selectedMatchIndex;
    let selectedMatch = this.state.matches[selectedMatchIndex];
    let totalMatches = this.state.matches.length;

    switch (e.keyCode) {
      case keyCodes.DOWN_ARROW:
        if (this.state.open && selectedMatchIndex < totalMatches - 1) {
          this.isKeyboardScrolling_ = true;
          this.setState({selectedMatchIndex: selectedMatchIndex + 1});
          e.preventDefault();
        }
        else {
          this.setShowMatchesState();
        }
        break;
      case keyCodes.UP_ARROW:
        if (this.state.open && selectedMatchIndex > 0) {
          this.isKeyboardScrolling_ = true;
          this.setState({selectedMatchIndex: selectedMatchIndex - 1});
          e.preventDefault();
        }
        break;
      case keyCodes.ENTER:
        if (this.state.open && selectedMatch) {
          this.setSelectedMatchState(selectedMatch.id);
        }
        else {
          this.setShowMatchesState();
        }
        e.preventDefault();
        break;
      case keyCodes.TAB:
        if (this.state.open && selectedMatch) {
          this.setSelectedMatchState(selectedMatch.id);
        }
        break;
      case keyCodes.ESC:
        this.setHideMatchesState();
        break;
    }
  }

  handleMouseEnter(index) {
    if (!this.isScrolling_) this.setState({selectedMatchIndex: index});
  }

  handleScroll(e) {
    this.isScrolling_ = true;
    clearTimeout(this.scrollTimeout_);
    this.scrollTimeout_ = setTimeout(() => this.isScrolling_ = false, 100);
  }

  setShowMatchesState() {
    this.setState({open: true, selectedMatchIndex: 0});
  }

  setHideMatchesState() {
    this.setState({open: false});
  }

  setSelectedMatchState(value) {
    this.setState({value, selectedMatchIndex: 0, open: false});
    this.props.onChange.call(this, {target:{value, name: this.props.name}});
  }

  findMatches(value, options = this.props.options) {
    // TODO(philipwalton): this can be optimzed further. If the value starts
    // with the previous value as a substring, then we only need to search
    // through the previous matches.
    return filter(options, (option) => this.matchesOption(value, option));
  }

  matchesOption(search, option) {
    search = search.toLowerCase();
    for (let key in option) {
      if (option[key].toLowerCase().includes(search)) return true;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      nextState.value === this.state.value &&
      nextState.matches === this.state.matches &&
      nextState.selectedMatchIndex === this.state.selectedMatchIndex &&
      nextState.open === this.state.open
    );
  }

  render() {

    let className = 'SearchSuggest';
    if (this.state.open && this.state.matches.length) {
      className += ' SearchSuggest--open';
    }

    return (
      <div className={className}>
        <input
          className="SearchSuggest-field FormField"
          name={this.props.name}
          value={this.state.value}
          onClick={this.setShowMatchesState.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          ref="input" />

        <ul
          className="SearchSuggest-matches"
          onScroll={this.handleScroll.bind(this)}
          ref="matches">
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
