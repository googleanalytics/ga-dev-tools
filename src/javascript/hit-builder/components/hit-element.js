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

  state = {
    value: this.props.hitPayload,
    hitSent: false,
    hitPayloadCopied: false
  }


  /**
   * Updates the values state when the users changes the hit text.
   * @param {Object} e The React event object.
   */
  handleChange = (e) => {
    this.setState({value: e.target.value});
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
   * @param {Object} e The React event object.
   */
  handleBlur = (e) => {
    $('body').removeClass('is-editing');
    this.props.onBlur(e.target.value);
  }


  /**
   * Sends the hit payload to Google Analytics and updates the button state
   * to indicate the hit was successfully sent. After 1 second the button
   * gets restored to its original state.
   */
  sendHit = () => {
    $.ajax({
      method: 'POST',
      url: 'https://www.google-analytics.com/collect',
      data: this.state.value
    })
    .then(() => {
      this.setState({hitSent: true})

      // After three second, remove the success checkbox.
      setTimeout(() => this.setState({hitSent: false}), 1000);
    });
  }


  /**
   * Copies the hit payload and updates the button state to indicate the hit
   * was successfully copied. After 1 second the button gets restored to its
   * original state.
   */
  copyHitPayload = () => {
    let hitPayload = React.findDOMNode(this.refs.hitPayload);
    if (copyElementText(hitPayload)) {
      this.setState({hitPayloadCopied: true, hitUriCopied: false});

      // After three second, remove the success checkbox.
      clearTimeout(this.hitPayloadCopiedTimeout_);
      this.hitPayloadCopiedTimeout_ =
          setTimeout(() => this.setState({hitPayloadCopied: false}), 1000);
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
    let shareUrl = React.findDOMNode(this.refs.shareUrl);
    if (copyElementText(shareUrl)) {
      this.setState({hitUriCopied: true, hitPayloadCopied: false});

      // After three second, remove the success checkbox.
      clearTimeout(this.hitUriCopiedTimeout_);
      this.hitUriCopiedTimeout_ =
          setTimeout(() => this.setState({hitUriCopied: false}), 1000);
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
            <div class="HitElement-statusBody">
              <h1 className="HitElement-statusHeading">Hit is valid!</h1>
              <p className="HitElement-statusMessage">Use the controls below to
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
        )
    }
  }


  /**
   * Returns the rendered components that make up the hit action buttons.
   * @return {Object}
   */
  renderHitActions() {
    if (this.props.hitStatus != 'VALID') {
      let buttonText = (this.props.hitStatus == 'INVALID' ?
          'Revalidate' : 'Validate') + ' hit';
      return (
        <div className="HitElement-action">
          <button
            className="Button Button--action"
            onClick={this.props.onValidate}>
            {buttonText}
          </button>
        </div>
      )
    }

    let sendHitButton = (
      <IconButton
        className="Button Button--success Button--withIcon"
        type={this.state.hitSent ? 'check' : 'send'}
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
              type={this.state.hitPayloadCopied ? 'check' : 'content-paste'}
              onClick={this.copyHitPayload}>
              Copy hit payload
            </IconButton>
            <IconButton
              type={this.state.hitUriCopied ? 'check' : 'link'}
              onClick={this.copyShareUrl}>
              Copy sharable link to hit
            </IconButton>
          </div>
          <div
            ref="hitPayload"
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


  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
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
    )
  }

}


/**
 * Copies the text content from the passed HTML element.
 * @param {HTMLElement} element The element to copy text from.
 * @return {boolean} true if the copy action was successful.
 */
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
