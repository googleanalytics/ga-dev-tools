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


/* global $ */


import Collection from '../collection';
import map from 'lodash/collection/map';
import Model from '../model';
import querystring from 'querystring';
import url from 'url';


const REQUIRED_PARAMS = ['v', 't', 'tid', 'cid'];


export default class ParamsCollection extends Collection {

  /**
   * Creates a collection from a hit query string.
   * @constructor
   * @param {string} hit The hit query string.
   * @return {ParamsCollection}
   */
  constructor(hit) {
    super(createModelsFromParams(getParamsFromHit(hit)));

    // Bind methods.
    this.validate = this.validate.bind(this);
    this.toQueryString = this.toQueryString.bind(this);
  }


  /**
   * Updates a collection from a new hit query string.
   * @param {string} newHit The updated hit query string.
   */
  update(newHit) {
    let params = getParamsFromHit(newHit);
    let models = this.models.slice(0);
    let size = Math.max(params.length,  models.length);

    for (let i = 0; i < size; i++) {
      let model = models[i];
      let param = params[i];

      if (model && param) {
        model.set(param);
      }
      else if (!param) {
        this.remove(model);
      }
      else if (!model) {
        this.add(new Model(param))
      }
    }
  }


  /**
   * Returns true of the colleciton contains a model with the passed name.
   * @param {string} name The name of the model to look for.
   * @return {boolean}
   */
  has(name) {
    // TODO(philipwalton): optimize to not be O(n).
    for (let model of this.models) {
      if (model.get('name') == name) return true;
    }
  }


  /**
   * Returns true if the hit contains all the required param models.
   * @return {boolean}
   */
  hasRequiredParams() {
    // This assumes the required params are the first items in the collection.
    return REQUIRED_PARAMS.every((param, i) => this.models[i].get('value'));
  }


  /**
   * Returns the hit model data as a query string.
   * @return {string}
   */
  toQueryString() {
    let query = {};
    for (let model of this.models) {
      let name = model.get('name');
      let value = model.get('value');
      if (name && value) query[name] = value;
    }

    return querystring.stringify(query);
  }


  /**
   * Sends a validation request to the Measurement Protocol Validation Server
   * and returns a promise that will be fulfilled with the response.
   * @return {Promise}
   */
  validate() {
    let query = this.toQueryString();
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: 'https://www.google-analytics.com/debug/collect',
        data: query,
        dataType: 'json',
        success: (response) => resolve({response, query}),
        error: reject
      });
    });
  }

}


/**
 * Accepts a hit payload or URL and converts it into an array of param objects
 * where the required params are always first and in the correct order.
 * @param {string} hit A query string or hit payload.
 * @return {Array<Object>} The param models.
 */
function getParamsFromHit(hit = '') {
  // If the hit contains a "?", remove it and all characters before it.
  let searchIndex = hit.indexOf('?');
  if (searchIndex > -1) hit = hit.slice(searchIndex + 1);

  let query = querystring.parse(hit);

  // Create required models first, regardless of order in the hit.
  let requiredParams = [];
  for (let name of REQUIRED_PARAMS) {
    requiredParams.push({
      name: name,
      value: query[name],
      required: true
    });
    delete query[name];
  }

  // Create optional models after required models.
  let optionalParams = map(query, (value, name) =>
      ({name, value, isOptional: true}));

  return requiredParams.concat(optionalParams);
}


/**
 * Converts and array of param objects into an array of param models.
 * @param {string} hit A query string or hit payload.
 * @return {Array<Model>} The param models.
 */
function createModelsFromParams(params) {
  return map(params, (param) => new Model(param));
}
