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
import {convertParamsToHit} from '../hit';
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
   * Generates a random UUID value for the "cid" parameter.
   */
  handleGenerateUuid = () => {
    this.props.actions.editParamValue(this.props.params[3].id, uuid.v4());
  }


  /**
   * Accepts a param and returns a validation message (if one exits) for the
   * passed param.
   * @param {Object} param
   * @return {?Object}
   */
  getValidationMessageForParam(param) {
    let message = this.props.validationMessages.find((m) => m.param === param);
    return message && message.description;
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /** Forces focus on the newly created param. */
  componentDidUpdate() {
    this.newParamNeedsFocus_ = false;
  }


  /** @return {Object} */
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
          actions={this.props.actions}
          hitStatus={this.props.hitStatus}
          validationMessages={this.props.validationMessages}
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
            message={this.getValidationMessageForParam('v')} />

          <ParamSelectElement
            ref="t"
            actions={this.props.actions}
            param={params[1]}
            options={HIT_TYPES}
            message={this.getValidationMessageForParam('t')} />

          <ParamSearchSuggestElement
            ref="tid"
            actions={this.props.actions}
            param={params[2]}
            options={this.props.properties}
            placeholder="UA-XXXXX-Y"
            message={this.getValidationMessageForParam('tid')} />

          <ParamButtonElement
            ref="cid"
            actions={this.props.actions}
            param={params[3]}
            type="refresh"
            title="Randomly generate UUID"
            message={this.getValidationMessageForParam('cid')}
            onClick={this.handleGenerateUuid} />

          {params.slice(4).map((param) => {
            let isLast = (param === params[params.length - 1]);
            return (
              <ParamElement
                key={param.id}
                actions={this.props.actions}
                param={param}
                needsFocus={isLast && this.newParamNeedsFocus_}
                message={this.getValidationMessageForParam(param.name)}
                onRemove={() => this.props.actions.removeParam(param.id) } />
            );
          })}

          <div className="HitBuilderParam HitBuilderParam--action">
            <div className="HitBuilderParam-body">
              <IconButton
                type="add-circle"
                iconStyle={{color: 'hsl(150,60%,40%)'}}
                onClick={this.handleAddParam}>
                Add parameter
              </IconButton>
            </div>
          </div>

        </div>

      </div>
    );
  }
}
