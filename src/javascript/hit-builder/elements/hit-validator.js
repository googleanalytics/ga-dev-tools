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


import Collection from '../../collection';
import debounce from 'lodash/function/debounce';
import HitElement from './hit-element';
import Icon from '../../elements/icon';
import IconButton from '../../elements/icon-button';
import Model from '../../model';
import ParamElement from './param-element';
import ParamSelectElement from './param-select-element';
import ParamsCollection from '../params-collection';
import React from 'react';


// const DEFAULT_HIT = 'v=1&t=pageview';
const DEFAULT_HIT = 'v=1&t=pageview&tid=UA-12345-1&cid=1&dp=/&dr=http://example.com';

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


export default class HitValidator extends React.Component {

  constructor(props) {
    super(props)

    // Bind methods
    this.handleCreateNewHit = this.handleCreateNewHit.bind(this);
    this.handleEditExistingHit = this.handleEditExistingHit.bind(this);
    this.handleExistingHitChange = this.handleExistingHitChange.bind(this);
    this.handleAddParam = this.handleAddParam.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);

    // Don't validate too frequently.
    this.validateParams = debounce(this.validateParams, 500, {leading: true});

    this.state = {
      editing: false,
      // editing: true,
      allMessages: [],
      paramMessages: {},
      existingHitValue: 'v=1&t=pageview&tid=UA-12345-1&cid=1&dp=%2F'
    };

    this.params = new ParamsCollection(DEFAULT_HIT)
        .on('add', this.handleParamChange)
        .on('remove', this.handleParamChange)
        .on('change', this.handleParamChange)
  }

  handleCreateNewHit() {
    this.setState({editing: true});
  }

  handleEditExistingHit() {
    // TODO(philipwalton): update the collection module so this doesn't
    // have to be destroyed.
    this.params.destroy();

    this.params = new ParamsCollection(this.state.existingHitValue)
        .on('add', this.handleParamChange)
        .on('remove', this.handleParamChange)
        .on('change', this.handleParamChange)

    this.setState({editing: true});
    this.validateParams();
  }

  handleExistingHitChange(e) {
    this.setState({existingHitValue: e.target.value});
  }

  handleAddParam() {
    this.params.add(new Model({name:'', value:''}));
  }

  handleParamChange() {
    this.forceUpdate();
    this.validateParams();
  }

  validateParams() {
    this.params.validate().then((response) => {
      let result = response.hitParsingResult[0];

      if (result.valid) {
        this.setState({valid: true, allMessages: [], paramMessages: {}});
      }
      else {
        let {allMessages, paramMessages} =
            this.getErrorsFromParserMessage(result.parserMessage);

        this.setState({valid: false, allMessages, paramMessages});
      }
    });
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

  render() {

    if (!this.state.editing) {
      return (
        <div>
          <p><strong>Paste an existing hit into the text box below.</strong></p>
          <div className="FormControl">
            <textarea
              rows="3"
              className="FormField"
              value={this.state.existingHitValue}
              onChange={this.handleExistingHitChange} />
          </div>
          <div className="FormControl">
            <IconButton
              disabled={!this.state.existingHitValue}
              onClick={this.handleEditExistingHit}
              type="create">Edit hit
            </IconButton>
          </div>
          <p><strong>Or construct a new hit from scratch.</strong></p>
          <IconButton
            className="Button Button--withIcon Button--action"
            onClick={this.handleCreateNewHit}
            type="arrow-forward">
            Create new hit
          </IconButton>
        </div>
      )
    }
    else {
      return (
        <div>

          <HitElement hitUrl={this.params.toQueryString()} />

          <p style={{border:'1px solid',padding:'1em'}}>{this.state.allMessages.map((e) => e.description)}</p>

          <ParamSelectElement
            model={this.params.models[0]}
            ref="v"
            options={['1']}
            message={this.state.paramMessages['v']}
            onRemove={this.params.remove.bind(this.params, this.params.models[0])} />

          <ParamSelectElement
            model={this.params.models[1]}
            ref="t"
            options={HIT_TYPES}
            message={this.state.paramMessages['t']}
            onRemove={this.params.remove.bind(this.params, this.params.models[1])} />

          <ParamElement
            model={this.params.models[2]}
            ref="tid"
            placeholder="UA-XXXXX-Y"
            message={this.state.paramMessages['tid']}
            onRemove={this.params.remove.bind(this.params, this.params.models[2])} />

          <ParamElement
            model={this.params.models[3]}
            ref="cid"
            message={this.state.paramMessages['cid']}
            onRemove={this.params.remove.bind(this.params, this.params.models[3])} />

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
      )
    }
  }
}
