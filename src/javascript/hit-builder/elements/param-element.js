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


import Icon from '../../elements/icon';
import React from 'react';


const REFERENCE_URL = 'https://developers.google.com/' +
                      'analytics/devguides/collection/protocol/v1/parameters';


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
    return 'HitBuilderParam' + (this.isRequired() ?
        ' HitBuilderParam--required' : '');
  }

  getFieldClassName() {
    return 'FormField' + (this.props.message ? ' FormField--invalid' : '');
  }

  getPlaceholder() {
    // A placeholder is needed for proper baseline alignment.
    return this.props.placeholder || ' ';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model != this.state.model) {
      this.setState({
        name: nextProps.model.get('name'),
        value: nextProps.model.get('value')
      });
    }
  }

  renderLabel() {
    if (this.isRequired()) {
      return <label className="HitBuilderParam-label">{this.state.name}</label>;
    }
    else {
      return (
        <div className="HitBuilderParam-label">
          <span
            className="HitBuilderParam-removeIcon"
            tabIndex="1"
            title="Remove this parameter"
            onClick={this.remove}>
            <Icon type="remove-circle" />
          </span>
          <input
            className="FormField HitBuilderParam-inputLabel"
            value={this.state.name}
            onChange={this.handleNameChange} />
        </div>
      );
    }
  }

  renderHelpIcon() {
    return (
      <a
        href={`${REFERENCE_URL}#${this.state.name}`}
        tabIndex="1"
        title={`Learn more about the "${this.state.name}" parameter.`}
        className="HitBuilderParam-helpIcon">
        <Icon type="info-outline" />
      </a>
    )
  }

  renderMessage() {
    if (this.props.message) {
      return <div className="HitBuilderParam-info">{this.props.message}</div>;
    }
  }

  render() {
    return (
      <div className={this.getClassName()}>
        {this.renderLabel()}
        <div className="HitBuilderParam-body">
          <input
            className={this.getFieldClassName()}
            data-flex
            value={this.state.value}
            placeholder={this.getPlaceholder()}
            onChange={this.handleValueChange} />
          {this.renderHelpIcon()}
          {this.renderMessage()}
        </div>
      </div>
    );
  }

}
