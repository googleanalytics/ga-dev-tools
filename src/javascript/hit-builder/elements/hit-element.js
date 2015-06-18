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


import Icon from '../../elements/icon';
import IconButton from '../../elements/icon-button';
import React from 'react';
import Textarea from 'react-textarea-autosize';


export default class HitElement extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {value: this.props.hitPayload};
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleFocus() {
    $('body').addClass('is-editing');
  }

  handleBlur(e) {
    $('body').removeClass('is-editing');
    this.props.onBlur(e.target.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hitPayload != this.state.hitPayload) {
      this.setState({value: nextProps.hitPayload});
    }
  }

  render() {
    return (
      <div className="Box HitElement">
        {this.renderValidationStatus()}
        <div className="HitElement-requestInfo">
          POST /collect HTTP/1.1<br />
          Host: www.google-analytics.com
        </div>
        <div className="HitElement-payload">
          <Textarea style={{wordBreak:'break-all'}}
            className="FormField"
            value={this.state.value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur} />
        </div>
        {this.renderHitActions()}
      </div>
    )
  }

  renderValidationStatus() {
    switch (this.props.hitStatus) {
      case 'VALID':
        return (
          <div className="Box-header HitElement-status">
            <span
              className="HitElement-statusIcon HitElement-statusIcon--valid">
              <Icon type="check" />
            </span>
            <span className="HitElement-statusMessage">
              Hit is valid!
            </span>
          </div>
        )
      case 'INVALID':
        return (
          <div className="Box-header HitElement-status">
            <span
              className="HitElement-statusIcon HitElement-statusIcon--invalid">
              <Icon type="error-outline" />
            </span>
            <span className="HitElement-statusMessage">
              Hit is invalid! Fix the following errors.
            </span>
            <ul>
              {this.props.messages.map((message) => (
                <li key={message.parameter}>{message.description}</li>
              ))}
            </ul>
          </div>
        )
      case 'PENDING':
        return (
          <div className="Box-header HitElement-status">
            <span className="HitElement-statusIcon">
              <Icon type="create" />
            </span>
            <span className="HitElement-statusMessage">
              The hit is missing information. Please fill out all the required
              parameters below.
            </span>
          </div>
        )
    }
  }

  renderHitActions() {
    if (this.props.hitStatus == 'VALID') {
      return (
        <div className="HitElement-action">
          <IconButton
            className="Button Button--action Button--withIcon"
            type="send">
            Send hit
          </IconButton>
          <IconButton
            type="content-paste">
            Copy hit payload
          </IconButton>
        </div>
      )
    }
  }
}
