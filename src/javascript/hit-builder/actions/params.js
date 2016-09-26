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


import {setHitStatus} from './hit-status';
import * as types from './types';
import {setValidationMessages} from './validation-messages';
import {convertParamsToHit, convertHitToParams,
        getHitValidationResult} from '../hit';
import {gaAll} from '../../analytics';
import AlertDispatcher from '../../components/alert-dispatcher';


/**
 * Resets the hit status and removes any validation messages.
 * @param {Function} dispatch
 */
function resetHitValidationStatus(dispatch) {
  dispatch(setHitStatus('UNVALIDATED'));
  dispatch(setValidationMessages([]));
}


/**
 * Dispatches the ADD_PARAM action type and resets the hit validation status.
 * @return {Function}
 */
export function addParam() {
  return (dispatch) => {
    dispatch({type: types.ADD_PARAM});
    resetHitValidationStatus(dispatch);
  };
}


/**
 * Dispatches the REMOVE_PARAM action type with the passed ID and resets the
 * hit validation status.
 * @param {number} id The param ID to remove.
 * @return {Function}
 */
export function removeParam(id) {
  return (dispatch) => {
    dispatch({type: types.REMOVE_PARAM, id});
    resetHitValidationStatus(dispatch);
  };
}


/**
 * Dispatches the EDIT_PARAM_NAME action type with the passed ID and name
 * and resets the hit validation status.
 * @param {number} id The param ID to edit.
 * @param {string} name The param name to edit.
 * @return {Function}
 */
export function editParamName(id, name) {
  return (dispatch) => {
    dispatch({type: types.EDIT_PARAM_NAME, id, name});
    resetHitValidationStatus(dispatch);
  };
}


/**
 * Dispatches the EDIT_PARAM_VALUE action type with the passed ID and value
 * and resets the hit validation status.
 * @param {number} id The param ID to edit.
 * @param {string} value The param value to edit.
 * @return {Function}
 */
export function editParamValue(id, value) {
  return (dispatch) => {
    dispatch({type: types.EDIT_PARAM_VALUE, id, value});
    resetHitValidationStatus(dispatch);
  };
}


/**
 * Accepts a new hit string and updates the hit if it differs from the existing
 * hit. Also resets the validation status if the hit is new.
 * @param {string} newHit The new hit payload.
 * @return {Function}
 */
export function updateHit(newHit) {
  return (dispatch, getState) => {
    let oldHit = convertParamsToHit(getState().params);
    if (oldHit != newHit) {
      let params = convertHitToParams(newHit);
      dispatch({type: types.REPLACE_PARAMS, params});
      resetHitValidationStatus(dispatch);
    }
  };
}


/**
 * Validates the hit and updates the validation status and messages with the
 * results. If an error occurs while validating the hit it is displayed.
 * @return {Function}
 */
export function validateHit() {
  const formatMessage = (message) => {
    let linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/;
    return {
      param: message.parameter,
      description: message.description.replace(linkRegex, '').trim(),
      type: message.messageType,
      code: message.messageCode
    };
  };
  return async (dispatch, getState) => {

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
        gaAll('send', 'event', {
          eventCategory: 'Hit Builder',
          eventAction: 'validate',
          eventLabel: 'valid'
        });
      }
      else {
        dispatch(setHitStatus('INVALID'));
        dispatch(setValidationMessages(validationMessages.map(formatMessage)));
        gaAll('send', 'event', {
          eventCategory: 'Hit Builder',
          eventAction: 'validate',
          eventLabel: 'invalid'
        });
      }
    }
    catch(err) {
      // TODO(philipwalton): handle timeout errors and slow network connection.
      resetHitValidationStatus(dispatch);
      AlertDispatcher.addOnce({
        title: 'Oops, an error occurred while validating the hit',
        message: `Check your connection to make sure you're still online.
                  If you're still having problems, try refreshing the page.`
      });
      gaAll('send', 'event', {
        eventCategory: 'Hit Builder',
        eventAction: 'validate',
        eventLabel: 'error'
      });
    }
  };
}
