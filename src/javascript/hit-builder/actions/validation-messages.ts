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


/**
 * Returns the SET_VALIDATION_MESSAGES action type with the new messages.
 * @param {Array} validationMessages
 * @return {Object}
 */
export function setValidationMessages(validationMessages) {
  return {type: types.SET_VALIDATION_MESSAGES, validationMessages};
}
