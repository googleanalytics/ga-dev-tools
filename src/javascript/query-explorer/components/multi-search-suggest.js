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
import SearchSuggest from './search-suggest';


export default class MultiSearchSuggest extends SearchSuggest {

  setShowMatchesState() {
    let {search} = this.parseValue(this.state.value);

    // If search currently matches a known option and there are matches to
    // choose from, add the separator and assume the user is trying to select
    // another option.
    if (this.optionsMap[search] && this.state.matches.length) {
      let value = this.state.value + this.props.separator;

      // Since we're updating the value, call `handleChange`.
      this.handleChange({target:{value, name: this.props.name}});
    }
    super.setShowMatchesState();
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
    let {search, selected} = this.parseValue(this.state.value);
    let value = selected.concat([choice]).join(this.props.separator);
    super.setSelectedMatchState(value);
  }


  findMatches(value, options = this.props.options) {
    let {search, selected} = this.parseValue(value);

    // Convert `selected` to a Set for faster lookup.
    selected = new Set(selected);

    return filter(options, (option) =>
        this.doesNotMatchSelected(option, selected) &&
        this.matchesOption(search, option));
  }

  doesNotMatchSelected(option, selected) {
    return !selected.has(option.id);
  }

  parseValue(value) {
    let selected = value.split(this.props.separator);
    let search = selected.pop();
    return {search, selected};
  }

}

MultiSearchSuggest.defaultProps = SearchSuggest.defaultProps;
MultiSearchSuggest.defaultProps.separator = ',';
