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


import filter from 'lodash/filter';
import map from 'lodash/map';
import some from 'lodash/some';
import React from 'react';
import ReactDOM from 'react-dom';


export default class Select2MultiSuggest extends React.Component {

  static defaultProps = {
    value: ''
  }

  state = {
    value: this.props.value
  }

  /**
   * Returns a tag object given a tag ID, e.g. "ga:users".
   * @param {string} tagId The ID of the tag to get.
   * @return {Object} The matching object in `this.props.tags`.
   */
  getTagById(tagId) {
    return this.tagMap_[tagId.toLowerCase()];
  }


  /**
   * Creates a hash representation of an Array of tags for faster lookup.
   * @param {Array} tags An array of tag objects, usually `this.props.tags`.
   */
  buildTagMap(tags) {
    this.tagMap_ = {};
    for (let tag of tags) {
      this.tagMap_[tag.id.toLowerCase()] = tag;
    }
  }


  /**
   * Handles changes to the select2 component, updates state, and informs
   * the `this.props.onChange` handler.
   */
  handleChange() {
    let name = this.props.name;
    let value = ($(ReactDOM.findDOMNode(this)).val() || []).join(',');
    this.setState({value});
    this.props.onChange({target: {name, value}});
  }


  /**
   * The template to render the select2 tag items within the input field.
   * @param {Object} opt A select2 option comtaining an `element` property or a
   *     plain object with a `name` and `id` property.
   * @return {string} The rendered HTML string.
   */
  s2TagTemplate(opt) {
    let data = opt.element ? $(opt.element).data() : opt;
    return `<span title="${data.name}">${data.id}</span>`;
  }


  /**
   * The template to render the choices within the select2 dropdown.
   * @param {Object} opt A select2 option comtaining an `element` property or a
   *     plain object with a `name`, `group`, and `id` property.
   * @return {string} The rendered HTML string.
   */
  s2DropdownItemTemplate(opt) {
    let data = opt.element ? $(opt.element).data() : opt;
    return `
      <div class="SearchSuggestMatch">
        <span class="SearchSuggestMatch-category">${data.group}</span>
        <div class="SearchSuggestMatch-content">${data.name}</div>
        <div class="SearchSuggestMatch-extra">${data.id}</div>
      </div>`;
  }


  /**
   * Takes an input string entered by the user and parses it to look for
   * options. This allows the user to paste text like "ga:sessions,ga:users"
   * into the input field and have select2 automatically break it apart into
   * two options.
   * @param {string} input The text the user has entered.
   * @param {Array} selection A list of option the user has already selected.
   * @param {Function} selectCallback A function that accepts an option and adds
   *     it to the existing selections.
   * @return {string|undefined}
   */
  tokenizer = (input, selection, selectCallback) => {
    let parts = input.split(',');

    // If there aren't any parts, return immediately;
    if (parts.length <= 1) return input;

    for (let part of parts) {
      if (part && this.getTagById(part) &&
          !some(selection, {id: part})) {
        selectCallback(this.getTagById(part));
      }
    }
  }


  /**
   * Passes a text substring and an option ID and returns whether or not the
   * tag shoulc be considered a match. This custom function handles the "sort"
   * select case and it normalizes the ascending and descending versions of a
   * metric/dimension so it's impossible to select both of them.
   * @param {string} text The text the user has entered.
   * @param {string} id The ID of the tag to match against.
   * @return {boolean} Whether or not the text is a match for the tag.
   */
  matcher = (text, id) => {
    let tag = this.getTagById(id);
    let search = text.toLowerCase();
    let selectedTags = this.props.name == 'sort' ?
        map(this.state.value.split(','), (item) => item.replace(/\-/, '')) : [];

    let matches = tag.id.toLowerCase().includes(search) ||
        tag.name.toLowerCase().includes(search) ||
        tag.group.toLowerCase().includes(search);

    return matches && !selectedTags.includes(tag.id);
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /**
   * Binds the select2 change event to the component `handleChange()` method
   * once the component is mounted.
   */
  componentDidMount() {
    let $input = $(ReactDOM.findDOMNode(this));
    $input.on('change', this.handleChange.bind(this));
  }


  /**
   * Handles updating the state when new props are passed externally.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.tags != this.props.tags) {
      this.buildTagMap(nextProps.tags);
      let value = filter(this.state.value.split(','), (part) =>
          this.getTagById(part)).join(',');

      if (value != this.state.value) {
        let name = this.props.name;
        this.setState({value});
        this.props.onChange({target: {name, value}});
      }
    }
  }


  /**
   * Handles updating the select2 instance with the new options after a
   * state update.
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.tags != prevProps.tags) {
      let opts = {
        formatSelection: this.s2TagTemplate,
        formatResult: this.s2DropdownItemTemplate,
        tokenizer: this.tokenizer,
        matcher: this.matcher
      };
      $(ReactDOM.findDOMNode(this)).select2(opts);
    }
  }


  /**
   * Destroys the select2 instance when the component unmounts.
   */
  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this)).select2('destroy').off();
  }


  /** @return {Object} */
  render() {
    return (
      <select
        className="FormField FormFieldCombo-field"
        multiple
        value={this.state.value.split(',')}
        onChange={this.handleChange}>
        {this.props.tags && this.props.tags.map((tag) => {
          return (
            <option
              value={tag.id}
              data-id={tag.id}
              data-name={tag.name}
              data-group={tag.group}
              key={tag.id}>
              {tag.id}
            </option>
          );
        })}
      </select>
    );
  }
}
