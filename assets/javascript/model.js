import assign from 'lodash/object/assign';
import clone from 'lodash/lang/clone';
import each from 'lodash/collection/each';
import events from 'events';
import omit from 'lodash/object/omit';


export default class Model extends events.EventEmitter {

  constructor(props) {
    this.props_ = props || {};
    this.oldProps_ = {};
    this.changedProps_ = {};

    // Define getters and setters for all props.
    defineAccessors(this, Object.keys(this.props_));
  }

  get props() {
    return this.props_;
  }

  assign(newProps) {

    let hasChanges = false;

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

    if (hasChanges) this.emit('change', this.changedProps_);
  }

  unset(prop) {
    // Don't unset if the prop doesn't exist.
    if (!this.props_.hasOwnProperty(prop)) return;

    this.oldProps_ = clone(this.props_);
    this.changedProps_ = {};
    this.changedProps_[prop] = undefined;
    this.props_ = omit(this.props_, prop);

    this.emit('change', this.changedProps_);
  }

}


function defineAccessors(obj, keys) {
  each(keys, function(key) {
    if (!obj.hasOwnProperty(key)) {
      Object.defineProperty(obj, key, {
        get: function() {
          return this.props_[key];
        },
        set: function(value) {
          var newProps = {};
          newProps[key] = value;
          this.assign(newProps);
        }
      });
    }
  });
}
