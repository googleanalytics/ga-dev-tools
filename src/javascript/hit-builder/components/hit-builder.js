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


import accountSummaries from 'javascript-api-utils/lib/account-summaries';
import AlertDispatcher from '../../components/alert-dispatcher';
import Collection from '../../collection';
import debounce from 'lodash/function/debounce';
import escapeRegExp from 'lodash/string/escapeRegExp';
import HitElement from './hit-element';
import Icon from '../../components/icon';
import IconButton from '../../components/icon-button';
import Model from '../../model';
import ParamElement from './param-element';
import ParamButtonElement from './param-button-element';
import ParamSearchSuggestElement from './param-search-suggest-element';
import ParamSelectElement from './param-select-element';
import ParamsCollection from '../params-collection';
import React from 'react';
import unescape from 'lodash/string/unescape';
import uuid from 'uuid';


const DEFAULT_HIT = 'v=1&t=pageview';


const DEBOUNCE_DURATION = 500;


const HIT_TYPES = [
  'pageview',
  'screenview',
  'event',
  'transaction',
  'item',
  'social',
  'exception',
  'timing'
];


export default class HitBuilder extends React.Component {

  state = {
    hitStatus: 'PENDING',
    allMessages: [],
    paramMessages: {},
    properties: [],
    parameters: []
  };


  /**
   * @constructor
   * @param {Object} props The props object initially passed by React.
   * @return {HitBuilder}
   */
  constructor(props) {
    super(props);

    this.params = new ParamsCollection(this.getInitialHit())
        .on('add', this.handleParamChange)
        .on('remove', this.handleParamChange)
        .on('change', this.handleParamChange)
  }


  /**
   * Makes a request to the AccoutSummaries.get method updates the properties
   * state when done with the result.
   */
  getProperties() {
    accountSummaries.get().then((summaries) => {
      let properties = summaries.allProperties().map((property) => {
        return {
          name: property.name,
          id: property.id,
          group: summaries.getAccountByPropertyId(property.id).name
        }
      })
      this.setState({properties});
    });
  }


  /**
   * Makes a request for the parameter reference data and updates the
   * parameters state when done with the result.
   */
  getParameters() {
    $.getJSON('/public/json/parameter-reference.json', (data) => {
      let parameters = data.parameters.map((param) => {
        param.name = unescape(param.name);
        param.pattern = new RegExp(param.id.replace(/_/g, '\\d+'));
        return param;
      });
      this.setState({parameters});
    });
  }


  /**
   * Gets the initial hit from the URL if present. If a hit is found in the URL
   * it is captured and immediately stripped as to have two sources of state.
   * If no hit is found in the URL the default hit is used.
   * @return {string} The default hit.
   */
  getInitialHit() {
    let query = location.search.slice(1);

    if (query) {
      if (history && history.replaceState) {
        history.replaceState(history.state, document.title, location.pathname);
      }
      return query;
    }
    else {
      return DEFAULT_HIT;
    }
  }


  /**
   * Updates the state after the user has authorized.
   */
  handleUserAuthorized() {
    this.getParameters();
    this.getProperties();
  }


  /**
   * Adds new param models after a user clicks to the "Add parameter" button.
   * Also turns on a flag to indicate that this param needs focus after
   * rendering.
   */
  handleAddParam = () => {
    this.newParamNeedsFocus_ = true;
    this.params.add(new Model({name:'', value:''}));
  }


  /**
   * Rerenders the tool after any change occurs.
   */
  handleParamChange = () => {
    if (this.state.hitStatus == 'VALID') {
      this.setState({hitStatus: 'PENDING'})
    }
    else {
      this.forceUpdate();
    }
  }


  /**
   * Updates the param collection with a new hit value.
   * @param {string} hit The hit payload value.
   */
  handleHitChange = (hit) => {
    this.params.update(hit);
  }


  /**
   * Generates a random UUID value for the "cid" parameter.
   */
  handleGenerateUuid = () => {
    this.params.models[3].set({value: uuid.v4()});
  }


  /**
   * Validates the hit parameters and updates the hit status box according to
   * the validation state.
   */
  validateParams = () => {

    this.params.validate().then((data) => {

      // In some cases the query will have changed before the response gets
      // back, so we need to check that the result is for the current query.
      // If it's not, ignore it.
      if (data.query != this.params.toQueryString()) return;

      let result = data.response.hitParsingResult[0];
      if (result.valid) {
        this.setState({
          hitStatus: 'VALID',
          allMessages: [],
          paramMessages: {}
        });
      }
      else {
        let {allMessages, paramMessages} =
            this.getErrorsFromParserMessage(result.parserMessage);

        this.setState({
          hitStatus: 'INVALID',
          allMessages,
          paramMessages
        });
      }
    })
    // TODO(philipwalton): handle timeout errors and slow network connection.
    .catch((err) => {
      AlertDispatcher.addOnce({
        title: 'Oops, an error occurred while validating the hit',
        message: `Check your connection to make sure you're still online.
                  If you're still having problems, try refreshing the page.`
      });
    })
  }


  /**
   * Gets data about the hit errors from the parser message.
   * @return {Object} An object containing the "allMessages" property, which
   *     contains an array of all messages and a "paramMessages" property,
   *     which contains an object of only messages specific to individual
   *     parameters.
   */
  getErrorsFromParserMessage(messages) {
    let allMessages = []
    let paramMessages = {};

    function processMessage(message) {
      let linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/;
      return {
        parameter: message.parameter,
        description: message.description.replace(linkRegex, '').trim(),
        type: message.messageType,
        code: message.messageCode
      }
    }

    for (let message of messages) {
      let processedMessage = processMessage(message);
      if (this.params.has(processedMessage.parameter)) {
        let {parameter, description} = processedMessage;
        paramMessages[parameter] = description;
      }
      allMessages.push(processedMessage);
    }
    return {allMessages, paramMessages};
  }


  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthorized && !this.state.isAuthorized) {
      this.handleUserAuthorized();
    }
  }

  componentDidUpdate() {
    this.newParamNeedsFocus_ = false;
  }

  render() {

    return (
      <div>

        <div className="HeadingGroup HeadingGroup--h3">
          <h3>Hit summary</h3>
          <p>The box below displays the full hit and its validation status.
          You can update the hit in the text box and the parameter details
          below will be automatically updated.</p>
        </div>

        <HitElement
          hitStatus={this.state.hitStatus}
          messages={this.state.allMessages}
          onBlur={this.handleHitChange}
          onValidate={this.validateParams}
          hitPayload={this.params.toQueryString()} />

        <div className="HitBuilderParams">

          <div className="HeadingGroup HeadingGroup--h3">
            <h3>Hit parameter details</h3>
            <p>The fields below are a breakdown of the individual parameters
            and values for the hit in the text box above.
            When you update these values the hit above will be automatically
            updated.</p>
          </div>

          <ParamSelectElement
            model={this.params.models[0]}
            ref="v"
            options={['1']}
            message={this.state.paramMessages['v']} />

          <ParamSelectElement
            model={this.params.models[1]}
            ref="t"
            options={HIT_TYPES}
            message={this.state.paramMessages['t']} />

          <ParamSearchSuggestElement
            model={this.params.models[2]}
            ref="tid"
            options={this.state.properties}
            placeholder="UA-XXXXX-Y"
            message={this.state.paramMessages['tid']} />

          <ParamButtonElement
            model={this.params.models[3]}
            ref="cid"
            type="refresh"
            title="Randomly generate UUID"
            message={this.state.paramMessages['cid']}
            onClick={this.handleGenerateUuid} />

          {this.params.models.slice(4).map((model) => {
            let isLast = (this.params.last() == model);
            return (
              <ParamElement
                model={model}
                key={model.uid}
                needsFocus={isLast && this.newParamNeedsFocus_}
                message={this.state.paramMessages[model.get('name')]}
                onRemove={this.params.remove.bind(this.params, model)} />
            );
          })}

          <div className="HitBuilderParam HitBuilderParam--action">
            <div className="HitBuilderParam-body">
              <IconButton
                type="add-circle"
                iconStyle={{color:'hsl(150,60%,40%)'}}
                onClick={this.handleAddParam}>
                Add parameter
              </IconButton>
            </div>
          </div>

        </div>

      </div>
    )
  }
}
