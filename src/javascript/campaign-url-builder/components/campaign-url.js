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
import Textarea from 'react-textarea-autosize';
import classNames from 'classnames'
import {isNil} from 'lodash'
import {gaAll} from '../../analytics';
import AlertDispatcher from '../../components/alert-dispatcher';
import Icon from '../../components/icon';
import IconButton from '../../components/icon-button';
import supports from '../../supports';
import {shortenUrl} from '../../url-shortener';
import {copyElementText} from '../../utils';
import renderProblematic from './problematic.js'


const ACTION_TIMEOUT = 1500;


const INSTRUCTIONS_TEXT =
    'Fill out all the required fields above and a URL will be ' +
    'automatically generated for you here.';


const gaSendEvent = ({category, action, label}) =>
  gaAll('send', 'event', {
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  })


/**
 * A component that renders the generated campaign URL.
 */
export default class CampaignUrl extends React.Component {
  constructor(props) {
    super(props)

    const {element, eventLabel} = renderProblematic(props.url)
    if(!isNil(element)) {
      gaSendEvent({
        category: 'Campaign URL',
        action: 'Problematic URL',
        label: eventLabel,
      })
    }

    this.state = {
      urlCopied: false,
      shortUrl: null,
      showShortUrl: false,
      isShorteningUrl: false,

      // True if the user was warned and clicked "I know what I'm doing"
      problematicBypass: false,
      // If the url is problematic, this is the React Element containing
      // a warning that will be shown
      problematicElement: element,
      // The label sent to google analytics
      problematicEventLabel: eventLabel
    }
  }


  /**
   * Copies the hit share URL and updates the button state to indicate the URL
   * was successfully copied. After 1 second the button gets restored to its
   * original state.
   */
  copyUrl = () => {
    let url = ReactDOM.findDOMNode(this.refs.url);
    if (copyElementText(url)) {
      this.setState({urlCopied: true});

      gaSendEvent({
        category: 'Campaign URL',
        action: 'copy-to-clipboard',
        label: `${this.state.showShortUrl ? 'short' : 'long'} url`,
      });

      // After three second, remove the success checkbox.
      clearTimeout(this.urlCopiedTimeout_);
      this.urlCopiedTimeout_ = setTimeout(() =>
          this.setState({urlCopied: false}), ACTION_TIMEOUT);
    } else {
      // TODO(philipwalton): handle error case
    }
  }

  confirmProblematic = () => {
    gaSendEvent({
      category: 'CampaignUrl',
      action: 'bypass-problematic',
      label: this.state.problematicEventLabel
    })

    this.setState({problematicBypass: true})
  }


  /**
   * Makes a request to the Google Url Shortener service and updates the state
   * with the result. While the request is being made the `isShorteningUrl`
   * state is activated. If there's an error shortening the URL, an alert
   * is displayed.
   */
  shortenUrl = async () => {
    this.setState({isShorteningUrl: true});

    try {
      let shortUrl = await shortenUrl(this.props.url);
      this.setState({
        isShorteningUrl: false,
        shortUrl: shortUrl,
        showShortUrl: true,
      });
      gaSendEvent({
        category: 'Campaign URL',
        action: 'shorten',
        label: '(not set)',
      });
    } catch (err) {
      AlertDispatcher.addOnce({
        title: 'Oops, an error occurred trying to shorten the URL',
        message: err.message,
      });
      this.setState({
        isShorteningUrl: false,
        shortUrl: null,
        showShortUrl: false,
      });
    }
  }


  /**
   * Updates the state to show the original URL instead of the shortened one.
   */
  longenUrl = () => {
    this.setState({
      showShortUrl: false,
    });
    gaSendEvent({
      category: 'Campaign URL',
      action: 'unshorten',
      label: '(not set)',
    });
  }


  /**
   * Handles users clicking on the checkbox to add the campaign params to
   * the fragment (rather than the query).
   * @param {Event} e
   */
  handleUseFragmentToggle = e => {
    this.setState({
      urlCopied: false,
      shortUrl: null,
      showShortUrl: false,
      isShorteningUrl: false,
    });
    this.props.onUseFragmentToggle.call(this, e);
  }


  /**
   * Renders the URL box and the "use fragment" toggle below it.
   * @param {React Element|null} problematicElement If not null, this
   * elemenet is rendered near the Copy/Shorten buttons, to warn the
   * user that the URL is problematic.
   * @return {React Element}
   */
  renderUrl(problematicElement) {
    let url = this.state.showShortUrl ? this.state.shortUrl : this.props.url;
    return (
      <div>
        <p>Use this URL in any promotional channels you want to be associated
        with this custom campaign</p>
        <div className="CampaignUrlResult-item">
          <div className="FormControl FormControl--full">
            <div className="FormControl-body">
              <Textarea
                rows={2}
                className="FormField"
                value={url}
                readOnly />

              <label className="FormControl-info">
                <input
                  className="Checkbox"
                  type="checkbox"
                  onChange={this.handleUseFragmentToggle}
                  checked={!!this.props.useFragment}
                  />
                  Set the campaign parameters in the fragment portion of the URL
                  (not recommended).
              </label>
            </div>
          </div>
          {problematicElement}
          {this.renderButtons(problematicElement ? true : false)}
          <div ref="url" className="u-visuallyHidden">{url}</div>
        </div>
      </div>
    );
  }

  // NOTE(nathanwest): In the renderActionsButton, below, the IconButton
  // elements all have keys. This is because many of them are conditionally
  // rendered, which can confuse React's renderer, because it thinks that
  // a button that just disappeared and a button that just appeared are
  // all the same button. The keys let react know that they are different
  // buttons, which ensures that things like button state
  // (idle/hover/active/pressed) aren't eroneously preserved between
  // different buttons.

  /**
   * Renders the problematic URL warning button
   * @return {React Element} [description]
   */
  renderProblematicWarningButton() {
    return <div className="ButtonSet">
      <IconButton
        type="warning"
        onClick={this.confirmProblematic}
        key="confirmProblematicButton"
      >
        I know what I'm doing
      </IconButton>
    </div>
  }

  /**
   * Renders the Copy to Clipboard and Shorten URL buttons.
   * @return {React Element}
   */
  renderActionButtons() {
    return <div className="ButtonSet">
      <IconButton
        type={this.state.urlCopied ? 'check' : 'content-paste'}
        onClick={this.copyUrl}
        key="copyUrlButton"
      >
        Copy URL
      </IconButton>
      {this.state.showShortUrl ? (
        <IconButton
          type="refresh"
          onClick={this.longenUrl}
          key="refreshButton">
          Show full URL
        </IconButton>
      ) : (
        <IconButton
          type="link"
          disabled={this.state.isShorteningUrl}
          onClick={this.shortenUrl}
          key="shortenButton"
        >
          {this.state.isShorteningUrl ?
            'Shortening...' : 'Convert URL to Short Link'}
        </IconButton>
      )}
    </div>
  }

  /**
   * Render the button controls, under the URL. This will either be the
   * copy/shorten buttons, or a button warning the user that their URL
   * is problematic if that's the case.
   * @return {React Element}
   */
  renderButtons(isProblematic) {
    return supports.copyToClipboard() ? (
      <div className="CampaignUrlResult-item">
        {isProblematic && !this.state.problematicBypass ?
          this.renderProblematicWarningButton() :
          this.renderActionButtons()
        }
      </div>
    ) : null;
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /**
   * Resets the UI state of the URL prop changes.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.url !== this.props.url) {
      AlertDispatcher.removeAll();
      this.setState({
        shortUrl: null,
        showShortUrl: false,
        isShorteningUrl: false,
        problematicBypass: false,
      });

      // Compute the renderProblematic, and dispatch a GA event if the
      // state went from Not Problematic to Problematic
      // TODO(nathanwest): deduplicate this and the constructor code
      const {element, eventLabel} = renderProblematic(nextProps.url)
      this.setState(prevState => {
        if(isNil(prevState.problematicElement) && !isNil(element)) {
          gaSendEvent({
            category: 'Campaign URL',
            action: 'Problematic URL',
            label: eventLabel,
          })
        }
        return {
          problematicElement: element,
          problematicEventLabel: eventLabel
        }
      })
    }
  }


  /** @return {Object} The React component. */
  render() {
    const problematicElement = this.state.problematicElement
    const className = classNames("CampaignUrlResult", {
      'CampaignUrlResult-problem': problematicElement !== null
    })

    return (
      <div className={className}>
        {this.props.url ?
          <h3 className="CampaignUrlResult-title">
            Share the generated campaign URL
          </h3>
          : null }
        {this.props.url ? this.renderUrl(problematicElement) :
          <p className="CampaignUrlResult-item">
            <span
              style={{fontSize: '2em', color: '#bbb', verticalAlign: '-0.4em'}}
              className="HitElement-statusIcon">
              <Icon type="error-outline" />
            </span>
            {INSTRUCTIONS_TEXT}
        </p>}
      </div>
    );
  }
}
