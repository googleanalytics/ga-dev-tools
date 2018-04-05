// Copyright 2016 Google Inc. All rights reserved.
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
import includes from 'lodash/includes';
import keyBy from 'lodash/keyBy';
import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import Select from 'react-select';


/**
 * A components that renders a multi-suggest dropdown using react-select.
 */
export default class MultiSuggest extends React.Component {
  static propTypes = {
    maximumSelectionSize: propTypes.number,
    name: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    tags: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.string.isRequired,
        name: propTypes.string.isRequired,
        group: propTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    value: propTypes.arrayOf(propTypes.string),
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      tagMap: keyBy(nextProps.tags, tag => tag.id.toLowerCase()),
    };
  }

  /**
   * Returns a tag object given a tag ID, e.g. "ga:users".
   * @param {string} tagId The ID of the tag to get.
   * @return {Object} The matching object in `this.props.tags`.
   */
  getTagById(tagId) {
    return this.state.tagMap[tagId.toLowerCase()];
  }

  handleChange = value => {
    if (this.props.value.length < this.props.maximumSelectionSize) {
      this.props.onChange({target: {[this.props.name]: value}});
    }
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
  handlePaste = event => {
    const newValues = [];

    event.target.value.split(/[,;]/).forEach(part => {
      if (part && this.getTagById(part) && !this.props.values.includes(part)) {
        newValues.push(part);
      }
    });

    if (newValues.length > 0) {
      event.preventDefault();
      const newAllValues = this.props.values.concat(newValues);
      this.handleChange(newAllValues);
    }
  }

  /**
   * Passes a text substring and an option ID and returns whether or not the
   * tag shoulc be considered a match. This custom function handles the "sort"
   * select case and it normalizes the ascending and descending versions of a
   * metric/dimension so it's impossible to select both of them.
   */
  filterOptions = (options, filterText, selectedValues) => {
    const search = filterText.toLowerCase();
    const sortSearch = search.replace(/^-/, '');

    if (this.props.name === 'sort') {
      selectedValues = selectedValues.map(value => value.replace(/^-/, ''));
    }

    return options.filter(option =>
      (
        option.id.toLowerCase().includes(search) ||
        option.name.toLowerCase().includes(search) ||
        option.group.toLowerCase().includes(search)
      ) && (
        !selectedValues.includes(sortSearch)
      )
    );
  }

  static renderOption(item) {
    return <div className="SearchSuggestMatch">
      <span className="SearchSuggestMatch-category">{item.group}</span>
      <div className="SearchSuggestMatch-content">{item.name}</div>
      <div className="SearchSuggestMatch-extra">{item.id}</div>
    </div>;
  }

  static renderValue(item) {
    console.log(item);
    return <span title={item.name}>{item.id}</span>;
  }


  /** @return {Object} The React component. */
  render() {
    return <Select
      name={this.props.name}
      multi={true}
      value={this.props.value}
      valueKey="id"
      labelKey="name"
      options={this.props.tags}
      optionRenderer={this.renderOption}
      valueRenderer={this.renderValue}
      onChange={this.handleChange}
      inputProps={{
        onPaste: this.handlePaste,
      }}
      filterOptions={this.filterOptions}
      className="select2-container select2-container-multi FormField FormFieldCombo-field"
    />;
  }
}
