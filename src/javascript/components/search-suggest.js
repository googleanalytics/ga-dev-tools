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


import bindAll from 'lodash/bindAll';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import map from 'lodash/map';
import React from 'react';
import ReactDOM from 'react-dom';


const keyCodes = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
};


/**
 * A components that renders a search suggest dropdown.
 */
export default class SearchSuggest extends React.Component {

  static defaultProps = {
    value: '',
    options: [],
  }

  state = {
    value: this.props.value,
    matches: [],
    selectedMatchIndex: 0,
    open: false,
    above: false,
    invalid: this.props.inavlid,
  };

  /**
   * Sets a unique namespace used for binding and unbinding jQuery events.
   * @constructor
   * @param {Object} props The props object initially passed by React.
   */
  constructor(props) {
    super(props);
    this.namespace = 'SearchSuggest:' + this.props.name;
  }


  /**
   * Handles changes detected within the input and alert parent handlers.
   * @param {Object} e The React event wrapper.
   */
  handleChange(e) {
    let value = e.target.value;
    let name = this.props.name;

    this.setState({
      value: value,
      matches: this.findMatches(value),
      selectedMatchIndex: 0,
      open: true,
    });
    this.props.onChange.call(this, {target: {name, value}});
  }


  /**
   * Handles keydown events detected within the input.
   * @param {Object} e The React event wrapper.
   */
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
        } else {
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
        } else {
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


  /**
   * Handles keydown events detected within the input.
   * @param {number} index The index of the item receiving the event.
   */
  handleMouseEnter(index) {
    if (!this.isScrolling_) this.setState({selectedMatchIndex: index});
  }


  /**
   * Handles scroll events detected within the dropdown.
   */
  handleScroll() {
    this.isScrolling_ = true;
    clearTimeout(this.scrollTimeout_);
    this.scrollTimeout_ = setTimeout(() => this.isScrolling_ = false, 100);
  }


  /**
   * Updates the component state to show the matches dropdown.
   */
  setShowMatchesState() {
    let {spaceAbove, spaceBelow} = this.calculateDropdownSpace();
    this.setState({
      open: true,
      selectedMatchIndex: 0,
      above: spaceBelow < 0 && spaceAbove > spaceBelow,
    });
  }


  /**
   * Updates the component state to hide the matches dropdown.
   */
  setHideMatchesState() {
    this.setState({open: false, above: false});
  }


  /**
   * Updates the component state to hide the matches dropdown and set the
   * correct text after a match has been selected.
   * @param {string} value The value to set.
   */
  setSelectedMatchState(value) {
    this.setState({value, selectedMatchIndex: 0, open: false});
    this.props.onChange.call(this, {target: {value, name: this.props.name}});
  }


  /**
   * Accepts a value and an optional array of options and returns the options
   * that are considered matches for the given value.
   * @param {string} value The string to match against.
   * @param {Array} options A list of options. If no options are specified this
   *    defaults to `this.props.options`.
   * @return {Array} An array of items from the options that match.
   */
  findMatches(value, options = this.props.options) {
    // TODO(philipwalton): this can be optimzed further. If the value starts
    // with the previous value as a substring, then we only need to search
    // through the previous matches.
    return filter(options, (option) => this.matchesOption(value, option));
  }


  /**
   * Takes a search string and an options object and returns `true` if the
   * search string should be considered a match.
   * @param {string} search The string to search.
   * @param {Object} option An item in the `props.options` array.
   * @return {boolean} true if search is a match.
   */
  matchesOption(search, option) {
    search = search.toLowerCase();
    for (let key in option) {
      if (option[key].toLowerCase().includes(search)) return true;
    }
    return false;
  }


  /**
   * Takes an event object and determines if it came from outside this element.
   * If it did then the `setHideMatchesState` function is invoked.
   * @param {Object} e A jQuery event.
   */
  hideMatchesOnExternalEvent(e) {
    if (this.state.open === true &&
        !$.contains(ReactDOM.findDOMNode(this), e.target)) {
      this.setHideMatchesState();
    }
  }


  /**
   * Updates the `above` state if necessary.
   */
  repositionMatchesDropdown() {
    // Only run the below calculations if the dropdown is open.
    if (!this.state.open) return;

    let {spaceAbove, spaceBelow} = this.calculateDropdownSpace();

    // Don't update the `above` state if there is space in both directions.
    if (spaceAbove < 0 || spaceBelow < 0) {
      this.setState({above: spaceAbove > spaceBelow});
    }
  }


  /**
   * Calculates the space above and below the matches dropdown if it were open
   * in that direction.
   * @return {Object} An object with `spaceAbove` and `spaceBelow` properties.
   */
  calculateDropdownSpace() {
    let $input = $(ReactDOM.findDOMNode(this.refs.input));
    let $dropdown = $(ReactDOM.findDOMNode(this.refs.matches));

    let inputTop = $input.offset().top;
    let inputBottom = inputTop + $input.outerHeight();
    let dropdownHeight = $dropdown.outerHeight();
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();
    let spaceAbove = (inputTop - dropdownHeight) - viewportTop;
    let spaceBelow = viewportBottom - (inputBottom + dropdownHeight);

    return {spaceAbove, spaceBelow};
  }


  /**
   * Accepts a list of event parameters and returns a space separated string
   * of events with a unique namespace added, formatted for jQuery.
   * @param {Array<string>} events A list of event names.
   * @return {string} The jQuery formatted event argument.
   */
  namespaceEvents(...events) {
    let namespace = '.SearchSuggest:' + this.props.name;
    return map(events, (event) => event + namespace).join(' ');
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /**
   * Handles adding events the first time the component is added to the DOM.
   */
  componentDidMount() {
    this.setState({matches: this.findMatches(this.state.value)});

    bindAll(this, ['hideMatchesOnExternalEvent', 'repositionMatchesDropdown']);

    $(window).on(`click.${this.namespace} select2-opening.${this.namespace}`,
        this.hideMatchesOnExternalEvent);

    $(window).on(`scroll.${this.namespace} resize.${this.namespace}`,
        debounce(this.repositionMatchesDropdown, 100));
  }


  /**
   * Updates the state based on externally passed props.
   * @param {Object} props
   */
  componentWillReceiveProps(props) {
    if (props.options != this.props.options) {
      let matches = this.findMatches(this.state.value, props.options);
      this.setState({matches});
    }
    if (props.value != this.state.value) {
      this.setState({value: props.value});
    }
    if (props.invalid != this.state.invalid) {
      this.setState({invalid: props.invalid});
    }
  }


  /**
   * Avoids updates if nothing has changed.
   * @param {Object} nextProps
   * @param {Object} nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return !(
      nextState.value === this.state.value &&
      nextState.matches === this.state.matches &&
      nextState.selectedMatchIndex === this.state.selectedMatchIndex &&
      nextState.open === this.state.open &&
      nextState.above === this.state.above &&
      nextState.invalid === this.state.invalid
    );
  }


  /**
   * Updates the component after it has received new props/state to show the
   * currently selected option.
   * @param {Object} prevProps
   * @param {Object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    // If the update was triggered by a value change, make sure the dropdown
    // is always scrolled to the top so the first match is visible.
    if (this.state.value != prevState.value) {
      ReactDOM.findDOMNode(this.refs.matches).scrollTop = 0;
    }

    // If the user is scrolling through the matches via the up and down arrows
    // keys, make sure the selected match is always in view.
    if (this.isKeyboardScrolling_) {
      // TODO(philipwalton): is there a more React-y way of getting access
      // to this node? Using refs seems like overkill...
      let selectedElement = ReactDOM.findDOMNode(this.refs.matches)
          .children[this.state.selectedMatchIndex];

      // If there is no selected match, return immediately.
      if (!selectedElement) return;

      let selectedElementOffsetTop = selectedElement.offsetTop;
      let selectedElementClientHeight = selectedElement.clientHeight;
      let container = ReactDOM.findDOMNode(this.refs.matches);
      let containerScrollTop = container.scrollTop;
      let containerClientHeight = container.clientHeight;

      // If the select match element is below the visible part of the container.
      if (selectedElementOffsetTop + selectedElementClientHeight >
          containerScrollTop + containerClientHeight) {
        container.scrollTop = selectedElementOffsetTop +
            selectedElementClientHeight - containerClientHeight;
      } else if (selectedElementOffsetTop < containerScrollTop) {
        // The select match element is above the visible part of the container.
        container.scrollTop = selectedElementOffsetTop;
      }

      this.isKeyboardScrolling_ = false;
    }
  }


  /**
   * Removes all added jQuery events.
   */
  componentWillUnmount() {
    $(window).off('.' + this.namespace);
  }


  /** @return {Object} The React component. */
  render() {
    let className = 'SearchSuggest';
    if (this.state.open && this.state.matches.length) {
      className += ' SearchSuggest--open';
    }
    if (this.state.above) {
      className += ' SearchSuggest--above';
    }

    let fieldClassName = 'SearchSuggest-field FormField';
    if (this.state.invalid && !this.state.open) {
      fieldClassName += ' FormField--invalid';
    }

    return (
      <div className={className}>
        <input
          className={fieldClassName}
          name={this.props.name}
          value={this.state.value}
          placeholder={this.props.placeholder}
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
                key={index}>
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
            );
          })}
        </ul>
      </div>
    );
  }
}
