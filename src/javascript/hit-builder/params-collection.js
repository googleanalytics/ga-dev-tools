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


import Collection from '../collection';
import map from 'lodash/collection/map';
import Model from '../model';
import querystring from 'querystring';
import url from 'url';


/* global $ */


const REQUIRED_PARAMS = ['v', 't', 'tid', 'cid'];


export default class ParamsCollection extends Collection {

  constructor(hit) {
    super(createModelsFromHit(hit));

    // Bind methods.
    this.validate = this.validate.bind(this);
    this.toQueryString = this.toQueryString.bind(this);
  }

  // TODO(philipwalton): optimize to not be O(n).
  has(name) {
    for (let model of this.models) {
      if (model.get('name') == name) return true;
    }
  }

  toQueryString() {
    let query = this.models.reduce((obj, model) =>
        (obj[model.get('name')] = model.get('value'), obj), {});

    return querystring.stringify(query);
  }

  validate() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: 'https://www.google-analytics.com/debug/collect',
        data: this.toQueryString(),
        dataType: 'json',
        success: resolve,
        error: reject
      });
    });
  }

}


function createModelsFromHit(hit = '') {

  // If the hit contains a "?", remove it and all characters before it.
  let searchIndex = hit.indexOf('?');
  if (searchIndex > -1) hit = hit.slice(searchIndex + 1);

  let query = querystring.parse(hit);

  // Create required models first, regardless of order in the hit.
  let requiredModels = [];
  for (let name of REQUIRED_PARAMS) {
    requiredModels.push(new Model({
      name: name,
      value: query[name],
      required: true
    }));
    delete query[name];
  }

  // Create optional models after required models.
  let optionalModels = map(query, (value, name) =>
      new Model({name, value, isOptional: true}));

  return requiredModels.concat(optionalModels);
}
