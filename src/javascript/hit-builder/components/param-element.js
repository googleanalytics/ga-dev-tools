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


import Icon from '../../components/icon';
import React from 'react';
import ReactDOM from 'react-dom';


const REFERENCE_URL = 'https://developers.google.com/' +
                      'analytics/devguides/collection/protocol/v1/parameters';


export default class ParamElement extends React.Component {

  state = {
    name: this.props.model.get('name'),
    value: this.props.model.get('value')
  }

  /**
   * Updates the state and param model with the new name.
   * @return {Object} e The React event.
   */
  handleNameChange = (e) => {
    let data = {name: e.target.value, value: this.state.value};
    this.setState(data)
    this.props.model.set(data);
  }


  /**
   * Updates the state and param model with the new value.
   * @return {Object} e The React event.
   */
  handleValueChange = (e) => {
    let data = {name: this.state.name, value: e.target.value};
    this.setState(data)
    this.props.model.set(data);
  }


  /**
   * Invokes the passed onRemove handler.
   */
  remove = () => {
    this.props.onRemove();
  }


  /**
   * Returns whether or not the parameter is required.
   * @return {boolean}
   */
  isRequired() {
    return this.props.model.get('required');
  }


  /**
   * Returns the class name for the root component element.
   * @return {string}
   */
  getClassName() {
    return 'HitBuilderParam' + (this.isRequired() ?
        ' HitBuilderParam--required' : '');
  }


  /**
   * Returns the class name for the parameter value field.
   * @return {string}
   */
  getFieldClassName() {
    return 'FormField' + (this.props.message ? ' FormField--invalid' : '');
  }


  /**
   * Returns the field placeholder element from the passed properties or a
   * single spaced string to fix a baseline alignment bug in Chrome.
   * @return {string}
   */
  getPlaceholder() {
    return this.props.placeholder || ' ';
  }


  /**
   * Returns the rendered components that make up the parameter label.
   * @return {Object}
   */
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
            ref="labelField"
            value={this.state.name}
            onChange={this.handleNameChange} />
        </div>
      );
    }
  }


  /**
   * Returns the rendered components that make up the parameter help icon.
   * @return {Object}
   */
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


  /**
   * Returns the rendered components that make up the parameter error message.
   * @return {Object}
   */
  renderMessage() {
    if (this.props.message) {
      return <div className="HitBuilderParam-info">{this.props.message}</div>;
    }
  }


  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  componentDidMount() {
    if (this.props.needsFocus) {
      ReactDOM.findDOMNode(this.refs.labelField).focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model != this.state.model) {
      this.setState({
        name: nextProps.model.get('name'),
        value: nextProps.model.get('value')
      });
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
