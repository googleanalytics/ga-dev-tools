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
import {convertParamsToHit, convertHitToParams,
        getHitValidationResult} from '../hit';
import AlertDispatcher from '../../components/alert-dispatcher';


function resetHitValidationStatus(dispatch) {
  dispatch(setHitStatus('UNVALIDATED'));
  dispatch(setValidationMessages([]));
}


export function addParam() {
  return function(dispatch) {
    dispatch({type: types.ADD_PARAM});
    resetHitValidationStatus(dispatch);
  };
}


export function removeParam(id) {
  return function(dispatch) {
    dispatch({type: types.REMOVE_PARAM, id});
    resetHitValidationStatus(dispatch);
  };
}


export function editParamName(id, name) {
  return function(dispatch) {
    dispatch({type: types.EDIT_PARAM_NAME, id, name});
    resetHitValidationStatus(dispatch);
  };
}


export function editParamValue(id, value) {
  return function(dispatch) {
    dispatch({type: types.EDIT_PARAM_VALUE, id, value});
    resetHitValidationStatus(dispatch);
  };
}


export function updateHit(newHit) {
  return function(dispatch, getState) {
    let oldHit = convertParamsToHit(getState().params);
    if (oldHit != newHit) {
      let params = convertHitToParams(newHit);
      dispatch({type: types.REPLACE_PARAMS, params});
      resetHitValidationStatus(dispatch);
    }
  };
}


export function validateHit() {

  function formatMessage(message) {
    let linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/;
    return {
      param: message.parameter,
      description: message.description.replace(linkRegex, '').trim(),
      type: message.messageType,
      code: message.messageCode
    };
  }

  return async function(dispatch, getState) {

    let hit = convertParamsToHit(getState().params);
    dispatch(setHitStatus('VALIDATING'));

    try {
      let data = await getHitValidationResult(hit);

      // In some cases the query will have changed before the response gets
      // back, so we need to check that the result is for the current query.
      // If it's not, ignore it.
      if (data.hit != convertParamsToHit(getState().params)) return;

      let result = data.response.hitParsingResult[0];
      let validationMessages = result.parserMessage;

      if (result.valid) {
        dispatch(setHitStatus('VALID'));
        dispatch(setValidationMessages([]));
      }
      else {
        dispatch(setHitStatus('INVALID'));
        dispatch(setValidationMessages(validationMessages.map(formatMessage)));
      }
    }
    catch(err) {
      // TODO(philipwalton): handle timeout errors and slow network connection.
      dispatch(setHitStatus('UNVALIDATED'));
      dispatch(setValidationMessages([]));
      AlertDispatcher.addOnce({
        title: 'Oops, an error occurred while validating the hit',
        message: `Check your connection to make sure you're still online.
                  If you're still having problems, try refreshing the page.`
      });
    }
  };
}
