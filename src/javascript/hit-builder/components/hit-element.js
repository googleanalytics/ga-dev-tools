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


import Icon from '../../components/icon';
import IconButton from '../../components/icon-button';
import React from 'react';
import supports from '../../supports';
import Textarea from 'react-textarea-autosize';


export default class HitElement extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.sendHit = this.sendHit.bind(this);
    this.copyHitBody = this.copyHitBody.bind(this);
    this.copyShareUrl = this.copyShareUrl.bind(this);

    this.state = {
      value: this.props.hitPayload,
      hitSent: false,
      hitBodyCopied: false
    };
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

  sendHit() {
    $.ajax({
      method: 'POST',
      url: 'https://www.google-analytics.com/collect',
      data: this.state.value
    })
    .then(() => this.setState({hitSent: true}));
  }

  copyHitBody() {
    let hitBody = React.findDOMNode(this.refs.hitBody);
    if (copyElementText(hitBody)) {
      this.setState({hitBodyCopied: true});
    }
    else {
      // TODO(philipwalton): handle error case
    }
  }

  copyShareUrl() {
    let shareUrl = React.findDOMNode(this.refs.shareUrl);
    if (copyElementText(shareUrl)) {
      this.setState({hitUriCopied: true});
    }
    else {
      // TODO(philipwalton): handle error case
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hitPayload != this.state.hitPayload) {
      this.setState({
        value: nextProps.hitPayload,
        hitSent: false,
        hitBodyCopied: false,
        hitUriCopied: false
      });
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
              <p className="HitElement-statusMessage">Use the buttons below to
              copy the hit or share it with coworkers.<br />
              You can also send the hit to Google Analytics and watch
              it in action in the Real Time view.</p>
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
    if (this.props.hitStatus != 'VALID') return;

    let sendHitButton = (
      <IconButton
        className="Button Button--action Button--withIcon"
        type={this.state.hitSent ? 'check' : 'send'}
        onClick={this.sendHit}>
        Send hit to Google Analytics
      </IconButton>
    );

    if (supports.copyToClipboard()) {
      return (
        <div className="HitElement-action">
          {sendHitButton}
          <IconButton
            type={this.state.hitBodyCopied ? 'check' : 'content-paste'}
            onClick={this.copyHitBody}>
            Copy hit body
          </IconButton>

          <IconButton
            type={this.state.hitUriCopied ? 'check' : 'share'}
            onClick={this.copyShareUrl}>
            Copy link to hit
          </IconButton>
          <div
            ref="hitBody"
            className="u-visuallyHidden">
            {this.state.value}
          </div>
          <div
            ref="shareUrl"
            className="u-visuallyHidden">
            {location.protocol + '//' + location.host + location.pathname +
            '?' + this.state.value}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="HitElement-action">
          {sendHitButton}
        </div>
      )
    }
  }
}


function copyElementText(element) {
  let success = false;
  let range = document.createRange();
  range.selectNode(element);

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  try {
    success = document.execCommand('copy');
  } catch(e) {}

  window.getSelection().removeAllRanges();
  return success;
}
