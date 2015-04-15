import Collection from '../collection';
import map from 'lodash/collection/map';
import Model from '../model';
import querystring from 'querystring';
import url from 'url';


/* global $ */


const REQUIRED_PARAMS = ['v', 't', 'tid', 'cid'];


class ParamsCollection extends Collection {

  constructor(hit) {
    super(this.createModelsFromHit_(hit));
  }

  add(model) {
    let loremIpsum = require('lorem-ipsum');
    if (Math.random() < .5) {
      model.set('error', loremIpsum());
    }
    super.add(model);
  }

  toQueryString() {
    let query = this.models.reduce((obj, model) =>
        (obj[model.get('name')] = model.get('value'), obj), {});

    return querystring.stringify(query);
  }

  validate() {
    $.ajax({
      method: 'POST',
      url: 'https://www.google-analytics.com/debug/collect',
      data: this.toQueryString(),
      dataType: 'json'
    })
    .done(function(response) {
      let result = response.hitParsingResult[0];
      console.log(result.valid ? 'Valid' : 'Error');
      for (let m of result.parserMessage)
          console.log(m.parameter, m.description)
    })
    .fail(function() {
      console.log(arguments);
    })
  }

  createModelsFromHit_(hit = '') {
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

}

export default ParamsCollection;
