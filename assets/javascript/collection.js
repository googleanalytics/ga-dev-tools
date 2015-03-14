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


import each from 'lodash/collection/each';
import events from 'events';
import find from 'lodash/collection/find';
import Model from './model';
import without from 'lodash/array/without';


export default class Collection extends events.EventEmitter {

  constructor(models) {
    this.models_ = [];

    // Create a reference to a bound function to handle change events.
    // A reference is need so it can be removed later.
    this.handleChange_ = (model) => {
      debugger;
      this.emit('change', model);
    }

    each(models, (model) => this.add(model));
  }

  get models() {
    return this.models_;
  }

  get size() {
    return this.models.length;
  }

  get(id) {
    return find(this.models_, {id});
  }

  add(model) {
    if (!model.id) throw new Error('Models must have an "id" property.');

    model.on('change', this.handleChange_);

    this.models_.push(model);
    this.emit('add', model);
    return this;
  }

  remove(model) {
    // model can be a model object or the model's ID.
    if (typeof model == 'string') model = this.get(model);

    model.removeListener('change', this.handleChange_);

    this.models_ = without(this.models_, model);
    this.emit('remove', model);
    return this;
  }

  destroy() {
    each(this.models_, (m) => m.removeListener('change', this.handleChange_));
    this.removeAllListeners();
    this.models_ = null;
  }

}
