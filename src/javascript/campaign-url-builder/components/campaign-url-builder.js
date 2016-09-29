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
import Textarea from 'react-textarea-autosize';
import CampaignUrl from './campaign-url';
import {
  addParamsToUrl,
  extractParamsFromWebsiteUrl,
  removeEmptyParams,
  trimParams,
  REQUIRED_PARAMS
} from '../params';


export default class CampaignUrlBuilder extends React.Component {


  /**
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    if (this.props.websiteUrl) {
      this.bareUrl = extractParamsFromWebsiteUrl(
        this.props.websiteUrl).bareUrl;
    }
  }


  /**
   * Invoked when a user changes any of the <QueryForm> fields.
   * @param {Event|Object} e A native Event object, React event, or data object
   *     containing the target.name and target.value properties.
   */
  handleWebsiteUrlChange = ({target}) => {
    let {params, bareUrl} = extractParamsFromWebsiteUrl(target.value);

    this.bareUrl = bareUrl;
    this.props.actions.updateWebsiteUrl(target.value);
    this.props.actions.updateParams(params);
  }


  /**
   * Invoked when a user changes any of the <QueryForm> fields.
   * @param {Event|Object} e A native Event object, React event, or data object
   *     containing the target.name and target.value properties.
   */
  handleParamChange = ({target: {name, value}}) => {
    this.props.actions.updateParams({[name]: value});
  }


  /**
   * Invoked when a user toggles the "use fragment" checkbox.
   * @param {Event|Object} e A native Event object, React event, or data object
   *     containing the target.checked property.
   */
  handleUseFragmentToggle = ({target}) => {
    this.props.actions.updateSettings({useFragment: target.checked});
  }


  /**
   * Builds the final campaign URL from the component props.
   * @return {string|undefined} Returns the URL if the required params are
   *     present; undefined otherwise.
   */
  getCampaignUrl() {
    let {bareUrl} = this;
    let {params, settings} = this.props;
    let urlParams = trimParams(removeEmptyParams(params));

    if (bareUrl && REQUIRED_PARAMS.every((param) => urlParams[param])) {
      return addParamsToUrl(bareUrl, urlParams, settings.useFragment);
    }
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /** @return {Object} */
  render() {

    let {params, settings, websiteUrl} = this.props;

    let formControlClass = 'FormControl FormControl--inline';
    let requiredFormControlClass = formControlClass +' FormControl--required';

    return (
      <div>
        <form className="CampaignUrlForm">
          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Website URL</label>
            <div className="FormControl-body">
              <Textarea
                rows={3}
                className="FormField"
                placeholder=" "
                value={websiteUrl}
                onChange={this.handleWebsiteUrlChange} />
              <div className="FormControl-info">
                The full website URL (e.g. <code>https://www.example.com</code>)
              </div>
            </div>
          </div>

          <div className={requiredFormControlClass}>
            <label className="FormControl-label">Campaign Source</label>
            <div className="FormControl-body">
              <input
                className="FormField"
                name="utm_source"
                placeholder=" "
                value={params.utm_source || ''}
                onChange={this.handleParamChange} />
              <div className="FormControl-info">
                The referrer: (e.g.&nbsp;
                  <code>google</code>,&nbsp;
                  <code>newsletter</code>)
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">Campaign Medium</label>
            <div className="FormControl-body">
              <input
                className="FormField"
                name="utm_medium"
                placeholder=" "
                value={params.utm_medium || ''}
                onChange={this.handleParamChange} />
              <div className="FormControl-info">
                Marketing medium: (e.g.&nbsp;
                  <code>cpc</code>,&nbsp;
                  <code>banner</code>,&nbsp;
                  <code>email</code>)
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">Campaign Name</label>
            <div className="FormControl-body">
              <input
                className="FormField"
                name="utm_campaign"
                placeholder=" "
                value={params.utm_campaign || ''}
                onChange={this.handleParamChange} />
              <div className="FormControl-info">
                Product, promo code, or slogan (e.g. <code>spring_sale</code>)
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">Campaign Term</label>
            <div className="FormControl-body">
              <input
                className="FormField"
                name="utm_term"
                placeholder=" "
                value={params.utm_term || ''}
                onChange={this.handleParamChange} />
              <div className="FormControl-info">
                Identify the paid keywords
              </div>
            </div>
          </div>

          <div className={formControlClass}>
            <label className="FormControl-label">Campaign Content</label>
            <div className="FormControl-body">
              <input
                className="FormField"
                name="utm_content"
                placeholder=" "
                value={params.utm_content || ''}
                onChange={this.handleParamChange} />
              <div className="FormControl-info">
                Use to differentiate ads
              </div>
            </div>
          </div>
        </form>

        <CampaignUrl
          url={this.getCampaignUrl()}
          useFragment={settings.useFragment}
          onUseFragmentToggle={this.handleUseFragmentToggle} />

      </div>
    );
  }
}
