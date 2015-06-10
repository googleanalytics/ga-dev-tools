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


import React from 'react';


export default class ParamElement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.model.get('name'),
      value: this.props.model.get('value')
    }

    // Bind methods.
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.remove = this.remove.bind(this);
  }

  handleNameChange(event) {
    let data = {name: event.target.value, value: this.state.value};
    this.setState(data)
    this.props.model.set(data);
  }

  handleValueChange(event) {
    let data = {name: this.state.name, value: event.target.value};
    this.setState(data)
    this.props.model.set(data);
  }

  remove() {
    this.props.onRemove();
  }

  getClassName() {
    return 'ParamElement' + (this.props.message ? ' ParamElement--error' : '');
  }

  renderMessage() {
    return !this.props.message ? null : (
      <p><small>{this.props.message.description}</small></p>
    )
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <input
          value={this.state.name}
          onChange={this.handleNameChange} />
        <input
          value={this.state.value}
          onChange={this.handleValueChange} />
        { this.props.model.get('required') ?
            null : <button onClick={this.remove}>remove</button> }

        {this.renderMessage()}
      </div>
    );
  }

}
