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

import * as React from "react";
import * as ReactDOM from "react-dom";
import Icon from "../../components/icon";
import { Param } from "../types";
import actions from "../actions";

const REFERENCE_URL =
  "https://developers.google.com/" +
  "analytics/devguides/collection/protocol/v1/parameters";

interface ParamElementProps {
  param: Param;
  required?: boolean;
  message?: string;
  placeholder?: string;
  onRemove?: () => void;
  needsFocus?: boolean;
  dispatch: (a: any) => void;
}

/**
 * A component that renders an individual hit param name and value pair.
 */
export default class ParamElement<T = {}> extends React.Component<
  ParamElementProps & T
> {
  state = {
    name: this.props.param.name || "",
    value: this.props.param.value || ""
  };

  /**
   * Updates the state with the new name.
   */
  handleNameChange = ({
    target: { value: name }
  }: {
    target: { value: string };
  }) => {
    this.setState({ name });
    this.props.dispatch(actions.editParamName(this.props.param.id, name));
  };

  /**
   * Updates the state with the new value.
   */
  handleValueChange = ({
    target: { value }
  }: {
    target: { value: string };
  }) => {
    this.setState({ value });
    this.props.dispatch(actions.editParamValue(this.props.param.id, value));
  };

  /**
   * Returns the class name for the root component element.
   * @return {string}
   */
  getClassName(): string {
    return (
      "HitBuilderParam" +
      (this.props.required ? " HitBuilderParam--required" : "")
    );
  }

  /**
   * Returns the class name for the parameter value field.
   */
  getFieldClassName(): string {
    return "FormField" + (this.props.message ? " FormField--invalid" : "");
  }

  /**
   * Returns the field placeholder element from the passed properties or a
   * single spaced string to fix a baseline alignment bug in Chrome.
   */
  getPlaceholder(): string {
    return (this.props.placeholder as string | undefined) || " ";
  }

  /**
   * Returns the rendered components that make up the parameter label.
   * @return {Object}
   */
  renderLabel(): JSX.Element {
    const { name } = this.state;
    if (this.props.param.required) {
      return <label className="HitBuilderParam-label">{name}</label>;
    } else {
      return (
        <div className="HitBuilderParam-label">
          <span
            className="HitBuilderParam-removeIcon"
            tabIndex={1}
            title="Remove this parameter"
            onClick={this.props.onRemove}
          >
            <Icon type="remove-circle" />
          </span>
          <input
            className="FormField HitBuilderParam-inputLabel"
            ref="labelField"
            value={name}
            onChange={this.handleNameChange}
          />
        </div>
      );
    }
  }

  /**
   * Returns the rendered components that make up the parameter help icon.
   */
  renderHelpIcon(): JSX.Element {
    return (
      <a
        href={`${REFERENCE_URL}#${this.props.param.name}`}
        tabIndex={1}
        title={`Learn more about the "${this.props.param.name}" parameter.`}
        className="HitBuilderParam-helpIcon"
      >
        <Icon type="info-outline" />
      </a>
    );
  }

  /**
   * Returns the rendered components that make up the parameter error message.
   */
  renderMessage(): JSX.Element | null {
    if (this.props.message) {
      return <div className="HitBuilderParam-info">{this.props.message}</div>;
    }
    return null;
  }

  /** React lifecycyle method */
  componentDidMount() {
    if (this.props.needsFocus) {
      // Assumin this works as I migrate this to typescript.
      (ReactDOM.findDOMNode(this.refs.labelField)! as any).focus();
    }
  }

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /**
   * Updates the state if the component receives new props externally.
   */
  componentWillReceiveProps(nextProps: ParamElementProps) {
    if (nextProps.param != this.props.param) {
      const { name, value } = nextProps.param;
      this.setState({ name, value });
    }
  }

  /** @return {Object} The React component. */
  render(): JSX.Element {
    return (
      <div className={this.getClassName()}>
        {this.renderLabel()}
        <div className="HitBuilderParam-body">
          <input
            className={this.getFieldClassName()}
            data-flex
            value={this.state.value || ""}
            placeholder={this.getPlaceholder()}
            onChange={this.handleValueChange}
          />
          {this.renderHelpIcon()}
          {this.renderMessage()}
        </div>
      </div>
    );
  }
}
