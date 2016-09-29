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


/* global $ */


import React from 'react';
import ReactDOM from 'react-dom';
import Textarea from 'react-textarea-autosize';
import {gaAll} from '../../analytics';
import Icon from '../../components/icon';
import IconButton from '../../components/icon-button';
import supports from '../../supports';
import {copyElementText, sleep} from '../../utils';


const ACTION_TIMEOUT = 1500;


export default class HitElement extends React.Component {

  state = {
    value: this.props.hitPayload,
    hitSent: false,
    hitPayloadCopied: false,
    hitUriCopied: false
  }


  /**
   * Updates the values state when the users changes the hit text.
   * @param {string} value The input element's value property.
   */
  handleChange = ({target: {value}}) => {
    this.setState({value});
  }


  /**
   * Puts the UI in a mostly disabled state while the user is focused on
   * the hit textarea.
   */
  handleFocus = () => {
    $('body').addClass('is-editing');
  }


  /**
   * Removes the disabled state and calls the `onBlur` methods with the new
   * hit value.
   * @param {string} value The input element's value property.
   */
  handleBlur = ({target: {value}}) => {
    $('body').removeClass('is-editing');
    this.props.actions.updateHit(value);
  }


  /**
   * Sends the hit payload to Google Analytics and updates the button state
   * to indicate the hit was successfully sent. After 1 second the button
   * gets restored to its original state.
   */
  sendHit = async () => {
    await $.ajax({
      method: 'POST',
      url: 'https://www.google-analytics.com/collect',
      data: this.state.value
    });
    this.setState({hitSent: true});
    gaAll('send', 'event', {
      eventCategory: 'Hit Builder',
      eventAction: 'send',
      eventLabel: 'payload'
    });
    await sleep(ACTION_TIMEOUT);
    this.setState({hitSent: false});
  }


  /**
   * Copies the hit payload and updates the button state to indicate the hit
   * was successfully copied. After 1 second the button gets restored to its
   * original state.
   */
  copyHitPayload = () => {
    let hitPayload = ReactDOM.findDOMNode(this.refs.hitPayload);
    if (copyElementText(hitPayload)) {
      this.setState({hitPayloadCopied: true, hitUriCopied: false});

      gaAll('send', 'event', {
        eventCategory: 'Hit Builder',
        eventAction: 'copy-to-clipboard',
        eventLabel: 'payload'
      });

      // After three second, remove the success checkbox.
      clearTimeout(this.hitPayloadCopiedTimeout_);
      this.hitPayloadCopiedTimeout_ = setTimeout(() =>
          this.setState({hitPayloadCopied: false}), ACTION_TIMEOUT);
    }
    else {
      // TODO(philipwalton): handle error case
    }
  }


  /**
   * Copies the hit share URL and updates the button state to indicate the URL
   * was successfully copied. After 1 second the button gets restored to its
   * original state.
   */
  copyShareUrl = () => {
    let shareUrl = ReactDOM.findDOMNode(this.refs.shareUrl);
    if (copyElementText(shareUrl)) {
      this.setState({hitUriCopied: true, hitPayloadCopied: false});

      gaAll('send', 'event', {
        eventCategory: 'Hit Builder',
        eventAction: 'copy-to-clipboard',
        eventLabel: 'share URL'
      });

      // After three second, remove the success checkbox.
      clearTimeout(this.hitUriCopiedTimeout_);
      this.hitUriCopiedTimeout_ = setTimeout(() =>
          this.setState({hitUriCopied: false}), ACTION_TIMEOUT);
    }
    else {
      // TODO(philipwalton): handle error case
    }
  }


  /**
   * Returns the rendered components that make up the validation status.
   * @return {Object}
   */
  renderValidationStatus() {
    switch (this.props.hitStatus) {
      case 'VALID':
        return (
          <header className="HitElement-status">
            <span
              className="HitElement-statusIcon">
              <Icon type="check" />
            </span>
            <div className="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">Hit is valid!</h1>
              <p className="HitElement-statusMessage">Use the controls below to
              copy the hit or share it with coworkers.<br />
              You can also send the hit to Google Analytics and watch
              it in action in the Real Time view.</p>
            </div>
          </header>
        );
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
                {this.props.validationMessages.map((message) => (
                  <li key={message.param}>{message.description}</li>
                ))}
              </ul>
            </div>
          </header>
        );
      default:
        return (
          <header className="HitElement-status">
            <span
              className="HitElement-statusIcon">
              <Icon type="warning" />
            </span>
            <div className="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">
                This hit has not yet been validated
              </h1>
              <p className="HitElement-statusMessage">You can update the hit
              using any of the controls below.<br />
              When you're done, click the "Validate hit" button to make sure
              everything's OK.</p>
            </div>
          </header>
        );
    }
  }


  /**
   * Returns the rendered components that make up the hit action buttons.
   * @return {Object}
   */
  renderHitActions() {
    let {props, state} = this;
    let {actions, hitStatus} = props;

    if (hitStatus != 'VALID') {
      let buttonText = (hitStatus == 'INVALID' ? 'Rev' : 'V') +
          'alidate hit';

      return (
        <div className="HitElement-action">
          <button
            className="Button Button--action"
            disabled={hitStatus === 'VALIDATING'}
            onClick={actions.validateHit}>
            {hitStatus === 'VALIDATING' ? 'Validating...' : buttonText}
          </button>
        </div>
      );
    }

    let sendHitButton = (
      <IconButton
        className="Button Button--success Button--withIcon"
        type={state.hitSent ? 'check' : 'send'}
        onClick={this.sendHit}>
        Send hit to Google Analytics
      </IconButton>
    );

    if (supports.copyToClipboard()) {
      return (
        <div className="HitElement-action">
          <div className="ButtonSet">
            {sendHitButton}
            <IconButton
              type={state.hitPayloadCopied ? 'check' : 'content-paste'}
              onClick={this.copyHitPayload}>
              Copy hit payload
            </IconButton>
            <IconButton
              type={state.hitUriCopied ? 'check' : 'link'}
              onClick={this.copyShareUrl}>
              Copy sharable link to hit
            </IconButton>
          </div>
          <div
            ref="hitPayload"
            className="u-visuallyHidden">
            {state.value}
          </div>
          <div
            ref="shareUrl"
            className="u-visuallyHidden">
            {location.protocol + '//' + location.host + location.pathname +
            '?' + state.value}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="HitElement-action">
          {sendHitButton}
        </div>
      );
    }
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /**
   * Resets the hit if a new payload is entered by the user.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.hitPayload != this.state.hitPayload) {
      this.setState({
        value: nextProps.hitPayload,
        hitSent: false,
        hitPayloadCopied: false,
        hitUriCopied: false
      });
    }
  }

  /** @return {Object} */
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
            <div className="FormControl FormControl--full">
              <label className="FormControl-label">Hit payload</label>
              <div className="FormControl-body">
                <Textarea
                  className="FormField"
                  value={this.state.value}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur} />
              </div>
            </div>
          </div>
          {this.renderHitActions()}
        </div>
      </section>
    );
  }

}
