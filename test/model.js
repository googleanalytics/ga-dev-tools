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
import events from 'events';
import Model from '../src/javascript/model';
import sinon from 'sinon';


describe('Model', function() {

  let model, props;

  beforeEach(function() {
    props = {foo: 'bar', fizz: 'buzz'};
    model = new Model(props);
  })

  it('extends events.EventEmitter', function() {
    assert(model instanceof events.EventEmitter);
  });

  describe('.props', function() {

    it('returns all model props.', function() {
      assert.equal(model.props, props);
    });

  });

  describe('.changedProps', function() {

    it('keeps track of the props that have changed since the last set.',
        function() {

      model.set('foo', 'BAR');
      assert.deepEqual(model.changedProps, {foo: 'BAR'});
      model.set('fizz', 'BUZZ');
      assert.deepEqual(model.changedProps, {fizz: 'BUZZ'});

      model.set({foo: 'BAAAR', fizz: 'BUZZZ'});
      assert.deepEqual(model.changedProps, {foo: 'BAAAR', fizz: 'BUZZZ'});
    });

  });

  describe('.oldProps', function() {

    it('keeps track of the props as they were prior to the last set.',
        function() {

      model.set('foo', 'BAR');
      assert.deepEqual(model.oldProps, {foo: 'bar', fizz: 'buzz'});
      model.set('fizz', 'BUZZ');
      assert.deepEqual(model.oldProps, {foo: 'BAR', fizz: 'buzz'});

      model.set({foo: 'BAAAR', fizz: 'BUZZZ'});
      assert.deepEqual(model.oldProps, {foo: 'BAR', fizz: 'BUZZ'});
    });

  });

  describe('.get()', function() {

    it('gets an individual prop value.', function() {
      assert.equal(model.get('foo'), 'bar');
      assert.equal(model.get('fizz'), 'buzz');
    });

    it('gets all props.', function() {
      assert.equal(model.get(), model.props);
    });

  });


  describe('.set()', function() {

    it('assigns multiple props simultaneously', function() {
      assert.equal(model.props.foo, 'bar');
      assert.equal(model.props.fizz, 'buzz');

      model.set({foo: 'BAR', fizz: 'BUZZ'});
      assert.equal(model.props.foo, 'BAR');
      assert.equal(model.props.fizz, 'BUZZ');
    });

    it('emits a change event whenever its props change.', function() {
      let spy = sinon.spy();

      model.on('change', spy);

      model.set('foo', 'BAR');
      model.set('fizz', 'BUZZ');

      assert(spy.calledTwice);
      assert(spy.getCall(0).calledWith(model));
      assert(spy.getCall(1).calledWith(model));
      assert.equal(spy.getCall(0).thisValue, model);
      assert.equal(spy.getCall(1).thisValue, model);

      model.set({foo: 'BAAAR', fizz: 'BUZZZ'});

      assert(spy.calledThrice);
      assert(spy.getCall(2).calledWith(model));
      assert.equal(spy.getCall(2).thisValue, model);
    });

  });

  describe('.unset()', function() {

    it('deletes properties from a model', function() {
      model.unset('foo');
      assert(!model.hasOwnProperty('foo'));
      assert.deepEqual(model.props, {fizz: 'buzz'});
    });

  });

  describe('.destroy()', function() {

    it('nullifies its props.', function() {
      model.destroy();
      assert.strictEqual(model.props, null)
    });

    it('removes all event listeners.', function() {
      let spy = sinon.spy();

      model.on('change', spy);
      assert.equal(model.listeners('change').length, 1);

      model.destroy();
      assert.equal(model.listeners('change').length, 0);
    });
  });

});
