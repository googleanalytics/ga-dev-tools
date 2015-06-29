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

  constructor(props) {
    super(props)

    // Bind methods
    this.handleAddParam = this.handleAddParam.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleHitChange = this.handleHitChange.bind(this);
    this.handleGenerateUuid = this.handleGenerateUuid.bind(this);

    // Don't validate too frequently.
    this.validateParams = debounce(this.validateParams,
        DEBOUNCE_DURATION, {leading: true});

    this.state = {
      hitStatus: 'PENDING',
      allMessages: [],
      paramMessages: {},
      properties: [],
      parameters: []
    };

    this.params = new ParamsCollection(this.getInitialHit())
        .on('add', this.handleParamChange)
        .on('remove', this.handleParamChange)
        .on('change', this.handleParamChange)
  }

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

  handleUserAuthorized() {
    this.getParameters();
    this.getProperties();
  }

  handleAddParam() {
    this.params.add(new Model({name:'', value:''}));
  }

  handleParamChange() {
    this.forceUpdate();
    this.validateParams();
  }

  handleHitChange(hit) {
    this.params.update(hit);
  }

  handleGenerateUuid() {
    this.params.models[3].set({value: uuid.v4()});
  }

  validateParams() {
    if (this.params.hasRequiredParams()) {
      this.params.validate().then((data) => {

        // In some cases the query will have changed before the response gets
        // back, so we need to check that the result is for the current query.
        // If it's not, ignore it.
        if (data.query != this.params.toQueryString()) {
          // TODO(philipwalton): considering tracking when this happens.
          return;
        }

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
    else {
      this.setState({
        hitStatus: 'PENDING',
        allMessages: [],
        paramMessages: {}
      });
    }
  }

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

  componentDidMount() {
    this.validateParams();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthorized && !this.state.isAuthorized) {
      this.handleUserAuthorized();
    }
  }

  render() {

    return (
      <div>

        <div className="HeadingGroup HeadingGroup--h3">
          <h3>Hit summary</h3>
          <p>The box below displays the full hit and its validation status.
          Once all the required parameters have been completed, the hit will be
          automatically validated as it's updated.</p>
        </div>

        <HitElement
          hitStatus={this.state.hitStatus}
          messages={this.state.allMessages}
          onBlur={this.handleHitChange}
          hitPayload={this.params.toQueryString()} />

        <div className="HitBuilderParams">

          <div className="HeadingGroup HeadingGroup--h3">
            <h3>Hit parameter details</h3>
            <p>The fields below show the individual parameters and values for
            the hit above. When you update these values the hit above will
            be automatically updated and validated.</p>
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
            return (
              <ParamElement
                model={model}
                key={model.uid}
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
