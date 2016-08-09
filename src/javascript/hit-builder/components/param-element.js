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


import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../../components/icon';


const REFERENCE_URL = 'https://developers.google.com/' +
                      'analytics/devguides/collection/protocol/v1/parameters';


export default class ParamElement extends React.Component {

  state = {
    name: this.props.param.name || '',
    value: this.props.param.value || ''
  }

  /**
   * Updates the state with the new name.
   * @param {string} name The input element's value property.
   */
  handleNameChange = ({target: {value: name}}) => {
    this.setState({name});
    this.props.actions.editParamName(this.props.param.id, name);
  }


  /**
   * Updates the state with the new value.
   * @param {string} value The input element's value property.
   */
  handleValueChange = ({target: {value}}) => {
    this.setState({value});
    this.props.actions.editParamValue(this.props.param.id, value);
  }


  /**
   * Returns the class name for the root component element.
   * @return {string}
   */
  getClassName() {
    return 'HitBuilderParam' + (this.props.required ?
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
    let {name} = this.state;
    if (this.props.param.required) {
      return <label className="HitBuilderParam-label">{name}</label>;
    }
    else {
      return (
        <div className="HitBuilderParam-label">
          <span
            className="HitBuilderParam-removeIcon"
            tabIndex="1"
            title="Remove this parameter"
            onClick={this.props.onRemove}>
            <Icon type="remove-circle" />
          </span>
          <input
            className="FormField HitBuilderParam-inputLabel"
            ref="labelField"
            value={name}
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
        href={`${REFERENCE_URL}#${this.props.param.name}`}
        tabIndex="1"
        title={`Learn more about the "${this.props.param.name}" parameter.`}
        className="HitBuilderParam-helpIcon">
        <Icon type="info-outline" />
      </a>
    );
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


  /** React lifecycyle method */
  componentDidMount() {
    if (this.props.needsFocus) {
      ReactDOM.findDOMNode(this.refs.labelField).focus();
    }
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /**
   * Updates the state if the component receives new props externally.
   * @param {Object} nextProps
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.param != this.props.param) {
      let {name, value} = nextProps.param;
      this.setState({name, value});
    }
  }

  /** @return {Object} */
  render() {
    return (
      <div className={this.getClassName()}>
        {this.renderLabel()}
        <div className="HitBuilderParam-body">
          <input
            className={this.getFieldClassName()}
            data-flex
            value={this.state.value || ''}
            placeholder={this.getPlaceholder()}
            onChange={this.handleValueChange} />
          {this.renderHelpIcon()}
          {this.renderMessage()}
        </div>
      </div>
    );
  }

}
