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
import uuid from 'uuid';

import HitElement from './hit-element';
import ParamButtonElement from './param-button-element';
import ParamElement from './param-element';
import ParamSearchSuggestElement from './param-search-suggest-element';
import ParamSelectElement from './param-select-element';

import {convertParamsToHit, validateHit} from '../hit';

import Collection from '../../collection';
import AlertDispatcher from '../../components/alert-dispatcher';
import Icon from '../../components/icon';
import IconButton from '../../components/icon-button';


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
    allMessages: [],
    paramMessages: {},
  };


  /**
   * Adds a new param after a user clicks to the "Add parameter" button.
   * Also turns on a flag to indicate that this param needs focus after
   * rendering.
   */
  handleAddParam = () => {
    this.newParamNeedsFocus_ = true;
    this.props.actions.addParam();
  }


  /**
   * Updates the param collection with a new hit value.
   * @param {string} hit The hit payload value.
   */
  handleHitChange = (hit) => {
    // this.params.update(hit);
  }


  /**
   * Generates a random UUID value for the "cid" parameter.
   */
  handleGenerateUuid = () => {
    this.props.actions.editParamValue(this.props.params[3].id, uuid.v4());
  }


  /**
   * Validates the hit parameters and updates the hit status box according to
   * the validation state.
   */
  validateParams = () => {
    this.props.actions.setHitStatus('VALIDATING');

    validateHit(this.props.params).then((data) => {

      // In some cases the query will have changed before the response gets
      // back, so we need to check that the result is for the current query.
      // If it's not, ignore it.
      if (data.hit != convertParamsToHit(this.props.params)) return;

      let result = data.response.hitParsingResult[0];
      if (result.valid) {
        this.props.actions.setHitStatus('VALID');
        this.setState({
          allMessages: [],
          paramMessages: {}
        });
      }
      else {
        let {allMessages, paramMessages} =
            this.getErrorsFromParserMessage(result.parserMessage);

        this.props.actions.setHitStatus('INVALID');
        this.setState({
          allMessages,
          paramMessages
        });
      }
    })
    // TODO(philipwalton): handle timeout errors and slow network connection.
    .catch((err) => {
      this.props.actions.setHitStatus('UNVALIDATED');
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

      if (this.props.params.some((param) =>
          param.name === processedMessage.parameter)) {

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

  componentDidUpdate() {
    this.newParamNeedsFocus_ = false;
  }

  render() {

    let {params} = this.props;

    return (
      <div>

        <div className="HeadingGroup HeadingGroup--h3">
          <h3>Hit summary</h3>
          <p>The box below displays the full hit and its validation status.
          You can update the hit in the text box and the parameter details
          below will be automatically updated.</p>
        </div>

        <HitElement
          hitStatus={this.props.hitStatus}
          messages={this.state.allMessages}
          onBlur={this.handleHitChange}
          onValidate={this.validateParams}
          hitPayload={convertParamsToHit(params)} />

        <div className="HitBuilderParams">

          <div className="HeadingGroup HeadingGroup--h3">
            <h3>Hit parameter details</h3>
            <p>The fields below are a breakdown of the individual parameters
            and values for the hit in the text box above.
            When you update these values, the hit above will be automatically
            updated.</p>
          </div>

          <ParamSelectElement
            ref="v"
            actions={this.props.actions}
            param={params[0]}
            options={['1']}
            message={this.state.paramMessages['v']} />

          <ParamSelectElement
            ref="t"
            actions={this.props.actions}
            param={params[1]}
            options={HIT_TYPES}
            message={this.state.paramMessages['t']} />

          <ParamSearchSuggestElement
            ref="tid"
            actions={this.props.actions}
            param={params[2]}
            options={this.props.properties}
            placeholder="UA-XXXXX-Y"
            message={this.state.paramMessages['tid']} />

          <ParamButtonElement
            ref="cid"
            actions={this.props.actions}
            param={params[3]}
            type="refresh"
            title="Randomly generate UUID"
            message={this.state.paramMessages['cid']}
            onClick={this.handleGenerateUuid} />

          {params.slice(4).map((param, i) => {
            let isLast = (params.length - 1 === i);
            return (
              <ParamElement
                key={param.id}
                actions={this.props.actions}
                param={param}
                needsFocus={isLast && this.newParamNeedsFocus_}
                message={this.state.paramMessages[param.name]}
                onRemove={() => this.props.actions.removeParam(param.id) } />
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
