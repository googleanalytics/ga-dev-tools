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


import assert from 'assert';
import Collection from '../src/javascript/collection';
import events from 'events';
import Model from '../src/javascript/model';
import sinon from 'sinon';


describe('Collection', function() {

  var model1, model2, model3, model4, collection;

  beforeEach(function() {
    model1 = new Model({id: '1', prop: 'value'});
    model2 = new Model({id: '2', prop: 'value'});
    model3 = new Model({id: '3', prop: 'value'});
    model4 = new Model({id: '4', prop: 'value'});
    collection = new Collection([model1, model2, model3]);
  });

  afterEach(function() {
    model1.destroy();
    model2.destroy();
    model3.destroy();
    model4.destroy();
    collection.destroy();
  });

  it('extends events.EventEmitter', function() {
    assert(model1 instanceof events.EventEmitter);
  });

  it('accepts an initial array of models', function() {
    assert.deepEqual(collection.models_, [model1, model2, model3]);
  });

  describe('.models', function() {

    it('returns an array of all the collection\'s models.', function() {
      assert.deepEqual(collection.models, [model1, model2, model3]);
    });

  });

  describe('.size', function() {

    it('returns the number of models in the collection.', function() {
      assert.equal(collection.size, 3);
    });

  });

  describe('.get()', function() {

    it('gets a model by its ID.', function() {
      assert.equal(collection.get('2'), model2);
    });

  });

  describe('.add()', function() {

    it('adds a new model to the collection.', function() {
      collection.add(model4);
      assert.equal(collection.size, 4);
    });

    it('emits an "add" event invoked with the added model.', function() {
      let spy = sinon.spy();

      collection.on('add', spy);
      collection.add(model4);

      assert(spy.calledOnce);
      assert(spy.calledWith(model4));
    });

    it('listens for "change" events on the model and re-emits.', function() {
      let modelSpy = sinon.spy();
      let collectionSpy = sinon.spy();

      collection.on('change', collectionSpy);
      model4.on('change', modelSpy)
      model4.set('prop', 'newValue');

      assert(modelSpy.calledOnce);
      assert.equal(collectionSpy.callCount, 0);

      collection.add(model4);
      model4.set('prop', 'newerValue');
      assert(modelSpy.calledTwice);
      assert(collectionSpy.calledOnce);
    });

  });

  describe('.remove()', function() {

    it('removes a model from the collection.', function() {
      collection.remove(model1);
      assert.equal(collection.size, 2);
    });

    it('accepts a model object or a model ID.', function() {
      collection.remove(model1);
      collection.remove('2');
      assert.equal(collection.size, 1);
    });


    it('emits a "remove" event invoked with the removed model.', function() {
      let spy = sinon.spy();

      collection.on('remove', spy);
      collection.remove(model1);
      assert(spy.calledOnce);
      assert(spy.calledWith(model1));

      collection.remove('2');
      assert(spy.calledTwice);
      assert(spy.calledWith(model2));
    });

    it('stops listening to "change" events on the removed model.', function() {
      let modelSpy = sinon.spy();
      let collectionSpy = sinon.spy();

      collection.on('change', collectionSpy);
      model1.on('change', modelSpy)

      model1.set('prop', 'newValue');
      assert(modelSpy.calledOnce);
      assert(collectionSpy.calledOnce);

      collection.remove(model1);
      model1.set('prop', 'newerValue');
      assert(modelSpy.calledTwice);
      assert(collectionSpy.calledOnce);
    });

  });

  describe('.destroy()', function() {

    it('nullifies its models property.', function() {
      collection.destroy();
      assert.strictEqual(collection.models, null)
    });

    it('removes all event listeners.', function() {
      let spy = sinon.spy();

      collection.on('add', spy);
      collection.on('remove', spy);
      collection.on('change', spy);

      assert.equal(collection.listeners('add').length, 1);
      assert.equal(collection.listeners('remove').length, 1);
      assert.equal(collection.listeners('change').length, 1);

      collection.destroy();

      assert.equal(collection.listeners('add').length, 0);
      assert.equal(collection.listeners('remove').length, 0);
      assert.equal(collection.listeners('change').length, 0);
    });

  });

});
