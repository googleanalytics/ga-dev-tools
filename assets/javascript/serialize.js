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


/*global $ */


/**
 * Consumes a form element and return an array of items with the keys `name`
 * and `value`. The returned array will only include items with truthy values.
 * @return {Array} An array of form values.
 */
function serialize(form) {
  return $(form).serializeArray().filter(function(item) {
    return !!item.value;
  });
}


module.exports = {

  /**
   * Serialize a form element into its object representation, filtering out
   * falsy values.
   * @param {HTMLElement} form The form element whose fields to serialize.
   * @return {Object} An object whose keys are the field names and values
   *     are the field values.
   */
  asObject: function(form) {
    var obj = {};
    serialize(form).forEach(function(item) {
      obj[item.name] = item.value;
    });
    console.log(obj);
    return obj;
  },

  /**
   * Serialize a form element into a query string representation, filtering out
   * falsy values.
   * @param {HTMLElement} form The form element whose fields to serialize.
   * @return {string} A query string of form fields and values.
   */
  asQueryString: function(form) {
    return encodeURI('?' + serialize(form).map(function(item) {
      return item.name + '=' + item.value;
    }).join('&'));
  }

};
