import assign from 'lodash-node/modern/object/assign';
import clone from 'lodash-node/modern/lang/clone';
import each from 'lodash-node/modern/collection/each';
import events from 'events';
import omit from 'lodash-node/modern/object/omit';


function defineGetters(obj, keys) {
  each(keys, function(key) {
    if (!obj.hasOwnProperty(key)) {
      Object.defineProperty(obj, key, {
        get: function() {
          return this.attributes_[key];
        }
      });
    }
  });
}


class Model extends events.EventEmitter {

  constructor(attributes) {
    // Set the initial attributes by merging the passed attributes
    // with the defaults set on the model prototype (if present).
    assign(this.attributes_ = {}, this.defaultAttributes_, attributes);

    this.oldAttributes_ = {};
    this.changedAttributes_ = {};

    // Apply getters and setters for the attribute keys.
    defineGetters(this, Object.keys(this.attributes_));
  }

  get(attribute) {
    return attribute ? this.attributes_[attribute] : this.attributes_;
  }

  set(newAttribute, newValue) {

    let hasChanges = false;
    let newAttributes = {};

    if (Object.isObject(newAttribute)) {
      newAttributes = newAttribute
    }
    else {
      newAttributes[newAttribute] = newValue;
    }

    this.oldAttributes_ = clone(this.attributes_);
    this.changedAttributes_ = {};

    each(newAttributes, (value, key) => {
      if (value !== this.oldAttributes_[key]) {
        hasChanges = true;
        this.changedAttributes_[key] = value;
      }
      this.attributes_[key] = value;
    });

    defineGetters(this, Object.keys(newAttributes));

    if (hasChanges) this.emit('change', this.changedAttributes_);
  }

  unset(attribute) {
    // Don't unset if the attribute doesn't exist.
    if (!this.attributes_.hasOwnProperty(attribute)) return;

    this.oldAttributes_ = clone(this.attributes_);
    this.changedAttributes_ = {};
    this.changedAttributes_[attribute] = undefined;
    this.attributes_ = omit(this.attributes_, attribute);

    this.emit('change', this.changedAttributes_);
  }

}

export default Model;
