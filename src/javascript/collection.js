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

  /**
   * Create a new collect instance with the specified models.
   * @constructor
   * @param {Array<Model>} props The initial props for the model.
   * @return {Collection}
   */
  constructor(models) {
    this.models_ = [];

    // Create a reference to a bound function to handle change events.
    // A reference is need so it can be removed later.
    this.handleChange_ = (model) => this.emit('change', model);

    each(models, (model) => this.add(model));
  }


  /*
   * Gets the current models.
   * @return {Array<Model>}
   */
  get models() {
    return this.models_;
  }


  /*
   * Gets size of the collect in terms of number of models.
   * @return {number}
   */
  get size() {
    return this.models.length;
  }


  /*
   * Gets a model by its `id` prop.
   * @return {Model}
   */
  get(id) {
    return find(this.models_, (model) => model.props.id == id);
  }


  /*
   * Adds a model to the collection.
   * @emits add
   * @return {Collection}
   */
  add(model) {
    if (!model.props.id) throw new Error('Models must have an "id" property.');

    model.on('change', this.handleChange_);

    this.models_.push(model);
    this.emit('add', model);
    return this;
  }


  /*
   * Removes a model from the collection.
   * @param {Model} model
   * @emits remove
   * @return {Collection}
   */
  remove(model) {
    // model can be a model object or the model's ID.
    if (typeof model == 'string') model = this.get(model);

    model.removeListener('change', this.handleChange_);

    this.models_ = without(this.models_, model);
    this.emit('remove', model);
    return this;
  }


  /**
   * Destroy a collection instance, cleaning up any events added to it or that
   * it added to its models.
   */
  destroy() {
    each(this.models_, (model) =>
        model.removeListener('change', this.handleChange_));

    this.removeAllListeners();
    this.models_ = null;
  }

}
