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
    let className = 'HitElement';
    if (this.props.hitStatus == 'VALID') className += ' HitElement--valid';
    if (this.props.hitStatus == 'INVALID') className += ' HitElement--invalid';

    return (
      <section className={className}>
        {this.renderValidationStatus()}
        <div className="HitElement-body">
          <div className="HitElement-requestInfo">
            POST /collect HTTP/1.1<br />
            Host: www.google-analytics.com
          </div>
          <div className="HitElement-requestBody">
            <Textarea
              className="FormField"
              value={this.state.value}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur} />
          </div>
          {this.renderHitActions()}
        </div>
      </section>
    )
  }

  renderValidationStatus() {
    switch (this.props.hitStatus) {
      case 'VALID':
        return (
          <header className="HitElement-status">
            <span
              className="HitElement-statusIcon">
              <Icon type="check" />
            </span>
            <div class="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">Hit is valid!</h1>
            </div>
          </header>
        )
      case 'INVALID':
        return (
          <header className="HitElement-status">
            <span
              className="HitElement-statusIcon">
              <Icon type="error-outline" />
            </span>
            <div className="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">Hit is invalid!</h1>
              <ul className="HitElement-statusMessage">
                {this.props.messages.map((message) => (
                  <li key={message.parameter}>{message.description}</li>
                ))}
              </ul>
            </div>
          </header>
        )
      case 'PENDING':
        return (
          <header className="HitElement-status">
            <span className="HitElement-statusIcon">
              <Icon type="create" />
            </span>
            <div className="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">
                The hit is missing required parameters.
              </h1>
              <p className="HitElement-statusMessage">All the required fields
              below must be filled out before the hit can be validated.</p>
            </div>
          </header>
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
            Copy hit body
          </IconButton>
        </div>
      )
    }
  }
}
