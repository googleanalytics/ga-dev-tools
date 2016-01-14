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


import * as types from './types';
import {setHitStatus} from './hit-status';
import {setValidationMessages} from './validation-messages';

import {convertParamsToHit, validateHit} from '../hit';

import AlertDispatcher from '../../components/alert-dispatcher';


export function addParam() {
  return {type: types.ADD_PARAM};
}

export function removeParam(id) {
  return {type: types.REMOVE_PARAM, id};
}

export function editParamName(id, name) {
  return {type: types.EDIT_PARAM_NAME, id, name};
}

export function editParamValue(id, value) {
  return {type: types.EDIT_PARAM_VALUE, id, value};
}

export function validateParams() {

  function formatMessage(message) {
    let linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/;
    return {
      param: message.parameter,
      description: message.description.replace(linkRegex, '').trim(),
      type: message.messageType,
      code: message.messageCode
    }
  }

  return function(dispatch, getState) {

    let {params} = getState();
    dispatch(setHitStatus('VALIDATING'));

    validateHit(params).then((data) => {

      let {params} = getState();

      // In some cases the query will have changed before the response gets
      // back, so we need to check that the result is for the current query.
      // If it's not, ignore it.
      if (data.hit != convertParamsToHit(params)) return;

      let result = data.response.hitParsingResult[0];
      let messages = result.parserMessage;

      if (result.valid) {
        dispatch(setHitStatus('VALID'));
        dispatch(setValidationMessages([]));
      }
      else {
        dispatch(setHitStatus('INVALID'));
        dispatch(setValidationMessages(messages.map(formatMessage)));
      }
    })
    // TODO(philipwalton): handle timeout errors and slow network connection.
    .catch((err) => {
      dispatch(setHitStatus('UNVALIDATED'));
      dispatch(setValidationMessages([]));
      AlertDispatcher.addOnce({
        title: 'Oops, an error occurred while validating the hit',
        message: `Check your connection to make sure you're still online.
                  If you're still having problems, try refreshing the page.`
      });
    })
  }
}