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
import React from 'react';
import SearchSuggest from './search-suggest';


const keyCodes = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40
};


export default class MultiSearchSuggest extends SearchSuggest {

  setShowMatchesState() {
    // The cursor position isn't available immediately upon focus, so we have
    // to wait a bit before we call `findMatches`.
    setImmediate(() => {
      // let {search, parts, cursorIndex} = this.getSearchText();
      // let lastPart = parts[parts.length - 1];
      //
      // // If the cursor is at the end of the input and the last part matches a
      // // known option and there are matches to choose from, add the separator
      // // and assume the user is trying to select another option.
      // if (cursorIndex == lastPart.endIndex &&
      //     this.optionsMap[lastPart.text] && this.state.matches.length) {
      //
      //   let value = this.state.value + this.props.separator;
      //   this.handleChange({target:{value, name: this.props.name}});
      // }

      this.setState({
        open: true,
        matches: this.findMatches(this.state.value),
        selectedMatchIndex: 0
      });
    });
  }

  setHideMatchesState() {
    if (this.state.value.endsWith(this.props.separator)) {
      let value = this.state.value.slice(0, -this.props.separator.length);
      this.setState({value});
      this.props.onChange.call(this, {target:{value, name: this.props.name}});
    }
    super.setHideMatchesState();
  }

  setSelectedMatchState(choice) {
    let {parts} = this.getSearchText();

    let caret;
    let value = parts.map((part) => {
      if (part.active) {
        caret = part.startIndex + choice.length;
        return choice;
      }
      else {
        return part.text;
      }
    })
    .join(this.props.separator);

    this.refs.input.selectionAfterUpdate = {
      startIndex: caret,
      endIndex: caret
    };

    super.setSelectedMatchState(value);
  }


  findMatches(value, options = this.props.options) {
    let {search, parts} = this.getSearchText(value);

    if (typeof search != 'string') return [];

    // Convert `selected` to a Set for faster lookup.
    let selected = new Set(parts
        .filter((part) => !part.active)
        .map((part) => part.text));

    return filter(options, (option) =>
        this.doesNotMatchSelected(option, selected) &&
        this.matchesOption(search, option));
  }

  doesNotMatchSelected(option, selected) {
    return !selected.has(option.id);
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case keyCodes.LEFT_ARROW:
      case keyCodes.RIGHT_ARROW:
      case keyCodes.UP_ARROW:
      case keyCodes.DOWN_ARROW:
        // the keydown event happens prior to the browser updating the select
        // location, so we have to do this asynchronously.
        setImmediate((input) =>
            this.setState({matches: this.findMatches(input.value)}), e.target);
    }
    super.handleKeyDown.call(this, e);
  }

  getSearchText(value = this.state.value, input) {

    let {startIndex, endIndex} = this.refs.input.selection.get();

    // If there's no cursor position, set this to the end of the string.
    // let cursorIndex = input ? input.selectionStart : value.length;

    let cursorIndex = endIndex == null ? value.length : endIndex;


    let index = 0;
    let search;

    let parts = value.split(this.props.separator).map((text) => {

      let startIndex = index;
      let endIndex = index + text.length;
      let part = {text, startIndex, endIndex};

      index += text.length + this.props.separator.length;

      if (cursorIndex >= startIndex && cursorIndex <= endIndex) {
        search = text;
        part.active = true;
      }

      return part;
    });

    log(search, parts, cursorIndex);

    return {search, parts, cursorIndex};
  }

  getValueAsHTML() {

    if (!this.refs.input) return this.state.value;

    let {parts} = this.getSearchText();

    let html = parts.map((part) => {
      let className = 'SearchSuggest-item';
      if (part.active) className += ' SearchSuggest-item--active';

      return `<span class="${className}">${part.text}</span>`;
    })
    .join(`<span class="SearchSuggest-separator">${this.props.separator}</span>`);

    return html;
  }

}

MultiSearchSuggest.defaultProps = SearchSuggest.defaultProps;
MultiSearchSuggest.defaultProps.separator = ',';
