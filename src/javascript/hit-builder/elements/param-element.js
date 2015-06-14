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


import IconButton from '../../elements/icon-button';
import React from 'react';


export default class ParamElement extends React.Component {

  constructor(props) {
    super(props);

    // Bind methods.
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.remove = this.remove.bind(this);

    this.state = {
      name: this.props.model.get('name'),
      value: this.props.model.get('value')
    }
  }

  handleNameChange(e) {
    let data = {name: e.target.value, value: this.state.value};
    this.setState(data)
    this.props.model.set(data);
  }

  handleValueChange(e) {
    let data = {name: this.state.name, value: e.target.value};
    this.setState(data)
    this.props.model.set(data);
  }

  remove() {
    this.props.onRemove();
  }

  isRequired() {
    return this.props.model.get('required');
  }

  getClassName() {
    return 'FormControl FormControl--inline' +
        (this.props.message ? ' FormControl--error' : '') +
        (this.isRequired() ? ' FormControl--required' : '');
  }

  getPlaceholder() {
    // A placeholder is needed for proper baseline alignment.
    return this.props.placeholder || ' ';
  }

  renderLabel() {
    if (this.isRequired()) {
      return <label className="FormControl-label">{this.state.name}</label>;
    }
    else {
      return (
        <div className="FormControl-label">
          <input
            style={{maxWidth:'6em', textAlign:'right'}}
            className="FormField"
            value={this.state.name}
            onChange={this.handleNameChange} />
        </div>
      );
    }
  }

  renderRemoveButton() {
    if (!this.isRequired()) {
      return (
        <IconButton
          type="remove-circle"
          onClick={this.remove}>
          remove
        </IconButton>
      );
    }
  }

  renderMessage() {
    if (this.props.message) {
      let linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/;
      let message = this.props.message.description.replace(linkRegex, '');
      return (
        <div className="FormControl-info">{message}</div>
      );
    }
  }

  render() {
    return (
      <div className={this.getClassName()}>
        {this.renderLabel()}
        <div className="FormControl-body">
          <div className="FlexLine">
            <input
              className="FormField"
              data-flex
              value={this.state.value}
              placeholder={this.getPlaceholder()}
              onChange={this.handleValueChange} />
            {this.renderRemoveButton()}
          </div>
          {this.renderMessage()}
        </div>
      </div>
    );
  }

}
