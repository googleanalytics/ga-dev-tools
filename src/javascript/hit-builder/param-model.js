import assign from 'lodash/object/assign';
import events from 'events';
import filter from 'lodash/collection/filter';
import find from 'lodash/collection/find';
import querystring from 'querystring';
import url from 'url';


const BASE_URL = 'https://www.google-analytics.com/collect?';


let pid = 0;


class ParamModel extends events.EventEmitter {

  get params() {
    return this.params_;
  }

  add(data = {name: '', value: ''}) {
    this.params_.push({
      name: data.name,
      value: data.value,
      pid: pid++
    });

    this.emit('change', this);
    return this;
  }

  remove(pid) {
    this.params_ = filter(this.params_, param => param.pid != pid);

    this.emit('change', this);
    return this;
  }

  update(pid, data) {
    let param = find(this.params_, {pid});
    assign(param, data);

    this.emit('change', this);
    return this;
  }

  parse(hitUrl) {

    // If the hit contains "?", remove it and all characters before it.
    let searchIndex = hitUrl.indexOf('?');
    if (searchIndex > -1) {
      hitUrl = hitUrl.slice(searchIndex + 1);
    }

    // Do not parse hits that don't contain a slash
    let query = querystring.parse(hitUrl);

    this.params_ = Object.keys(query).map((name, index) =>
        ({name, value: query[name], pid: pid++}));

    this.emit('change', this);
  }

  toQueryString() {
    let query = this.params.reduce((prev, cur) =>
        (prev[cur.name] = cur.value, prev), {});

    return querystring.stringify(query);
  }

}

export default ParamModel;
