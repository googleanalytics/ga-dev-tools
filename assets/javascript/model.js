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


import assign from 'lodash/object/assign';
import clone from 'lodash/lang/clone';
import each from 'lodash/collection/each';
import events from 'events';


export default class Model extends events.EventEmitter {

  /**
   * Create a new model instance with the specified props.
   * @constructor
   * @param {Object} props The initial props for the model.
   * @return {Model}
   */
  constructor(props) {
    this.props_ = props || {};
    this.oldProps_ = {};
    this.changedProps_ = {};
  }


  /*
   * Gets the current model props.
   * @return {Object}
   */
  get props() {
    return this.props_;
  }


  /*
   * Gets the props that changed during the last `.set()` call.
   * @return {Object}
   */
  get changedProps() {
    return this.changedProps_;
  }


  /*
   * Gets the props as they were prior to the last `.set()` call.
   * @return {Object}
   */
  get oldProps() {
    return this.oldProps_;
  }


  /*
   * Gets all props or an individual prop value.
   * @param {string} [prop] The optional prop name.
   * @return {*}
   */
  get(prop) {
    return prop ? this.props[prop] : this.props;
  }


  /**
   * Set a prop/value pair or an object of prop/value pairs.
   * @param {Object|string} prop An object or individual prop name.
   * @param {string} [value] The prop value when setting an individual prop.
   * @emits change
   */
  set(prop, value) {

    let hasChanges = false;
    let newProps = {};

    // Allow setting a single key/value pair or an object or key/value paris.
    if (typeof prop == 'string') {
      newProps[prop] = value;
    }
    else {
      newProps = prop;
    }

    this.oldProps_ = clone(this.props_);
    this.changedProps_ = {};

    each(newProps, (value, key) => {
      if (value !== this.oldProps_[key]) {
        hasChanges = true;
        this.changedProps_[key] = value;
      }
      this.props_[key] = value;
    });

    if (hasChanges) this.emit('change', this);
  }


  /**
   * Remove a prop from.
   * @param {string} prop The prop to remove.
   * @emits change
   */
  unset(prop) {
    
    // Don't unset if the prop doesn't exist.
    if (!this.props_.hasOwnProperty(prop)) return;

    this.oldProps_ = clone(this.props_);
    this.changedProps_ = {};
    this.changedProps_[prop] = undefined;

    delete this.props_[prop];

    this.emit('change', this);
  }


  /**
   * Destroy a model instance, cleaning up any events added to it.
   */
  destroy() {
    this.props_ = null;
    this.removeAllListeners();
  }

}
