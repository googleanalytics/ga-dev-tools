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

  constructor(props) {
    this.props_ = props || {};
    this.oldProps_ = {};
    this.changedProps_ = {};
  }

  get props() {
    return this.props_;
  }

  get changedProps() {
    return this.changedProps_;
  }

  get oldProps() {
    return this.oldProps_;
  }

  get(prop) {
    return prop ? this.props[prop] : this.props;
  }

  set(prop, value) {

    let hasChanges = false;
    let newProps = {};

    // Allow setting a single key/value pair or an object or key/value paris.
    if (typeof prop == 'string' && value) {
      newProps[prop] = value;
    }
    else {
      newProps = prop;
    }

    this.oldProps_ = clone(this.props_);
    this.changedProps_ = {};

    each(newProps, (value, key) => {
      if (!this.props_.hasOwnProperty(key)) {
        throw new Error(`Cannot assign prop '${key}'; it doesn't exist.`);
      }
      else if (value !== this.oldProps_[key]) {
        hasChanges = true;
        this.changedProps_[key] = value;
      }
      this.props_[key] = value;
    });

    if (hasChanges) this.emit('change', this);
  }

  unset(prop) {
    // Don't unset if the prop doesn't exist.
    if (!this.props_.hasOwnProperty(prop)) return;

    this.oldProps_ = clone(this.props_);
    this.changedProps_ = {};
    this.changedProps_[prop] = undefined;

    delete this.props_[prop];

    this.emit('change', this);
  }

  destroy() {
    this.props_ = null;
    this.removeAllListeners();
  }

}
