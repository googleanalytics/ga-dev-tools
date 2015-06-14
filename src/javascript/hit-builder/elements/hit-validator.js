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


const DEFAULT_HIT = 'v=1&t=pageview';
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

    // Don't validate too much.
    this.validateParams = debounce(this.validateParams, 500, {leading: true});

    this.state = {
      editing: false,
      generalErrors: [],
      paramErrors: {},
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
        this.setState({valid: true, paramErrors: {}, generalErrors: []});
      }
      else {
        let {paramErrors, generalErrors} =
            this.getErrorsFromParserMessage(result.parserMessage);

        this.setState({valid: false, paramErrors, generalErrors});
      }

      console.log(result.valid ? 'Valid' : 'Error');
      for (let m of result.parserMessage) console.log(m);
    })
    .catch(log);
  }

  getErrorsFromParserMessage(messages) {
    let paramErrors = {};
    let generalErrors = [];

    for (let message of messages) {
      if (this.params.has(message.parameter)) {
        paramErrors[message.parameter] = message;
      }
      else {
        generalErrors.push(message);
      }
    }
    return {paramErrors, generalErrors};
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

          <p style={{border:'1px solid',padding:'1em'}}>{this.state.generalErrors.map((e) => e.description)}</p>

          <ParamSelectElement
            model={this.params.models[0]}
            ref="v"
            options={['1']}
            message={this.state.paramErrors['v']}
            onRemove={this.params.remove.bind(this.params, this.params.models[0])} />

          <ParamSelectElement
            model={this.params.models[1]}
            ref="t"
            options={HIT_TYPES}
            message={this.state.paramErrors['t']}
            onRemove={this.params.remove.bind(this.params, this.params.models[1])} />

          <ParamElement
            model={this.params.models[2]}
            ref="tid"
            placeholder="UA-XXXXX-Y"
            message={this.state.paramErrors['tid']}
            onRemove={this.params.remove.bind(this.params, this.params.models[2])} />

          <ParamElement
            model={this.params.models[3]}
            ref="cid"
            message={this.state.paramErrors['cid']}
            onRemove={this.params.remove.bind(this.params, this.params.models[3])} />

          {this.params.models.slice(4).map((model) => {
            return (
              <ParamElement
                model={model}
                key={model.uid}
                message={this.state.paramErrors[model.get('name')]}
                onRemove={this.params.remove.bind(this.params, model)} />
            );
          })}

          <div className="FormControl FormControl--inline FormControl--action">
            <div className="FormControl-body">
              <IconButton
                type="add-circle"
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
