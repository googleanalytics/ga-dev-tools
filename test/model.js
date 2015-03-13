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
import Model from '../assets/javascript/model';
import sinon from 'sinon';


describe('Model', function() {

  it('extends events.EventEmitter', function() {
    let model = new Model();
    assert(model instanceof events.EventEmitter);
  });

  it('sets the default props on the model', function() {
    let props = {
      foo: 'bar',
      fizz: 'buzz'
    };
    let model = new Model(props);
    assert.equal(model.props, props);
  });

  it('creates getters and setters based on the default props', function() {
    let model = new Model({
      foo: 'bar',
      fizz: 'buzz'
    });
    assert.equal(model.foo, 'bar');
    assert.equal(model.fizz, 'buzz');

    model.foo = 'BAR';
    model.fizz = 'BUZZ';

    assert.equal(model.foo, 'BAR');
    assert.equal(model.fizz, 'BUZZ');
  })


  describe('.assign', function() {

    it('assigns multiple props simultaneously', function() {
      let model = new Model({
        foo: 'bar',
        fizz: 'buzz'
      });
      assert.equal(model.foo, 'bar');
      assert.equal(model.fizz, 'buzz');

      model.assign({
        foo: 'BAR',
        fizz: 'BUZZ'
      });
      assert.equal(model.foo, 'BAR');
      assert.equal(model.fizz, 'BUZZ');
    });

    it('throws if trying to assign an unrecognized prop.', function() {
      function assignBlock() {
        let model = new Model();
        model.assign({
          foo: 'BAR',
          fizz: 'BUZZ'
        });
      }
      assert.throws(assignBlock, Error);
    });

    it('emits a change event whenever its props change.', function() {
      let spy = sinon.spy();
      let model = new Model({
        foo: 'bar',
        fizz: 'buzz'
      });

      model.on('change', spy);

      model.foo = 'BAR';
      model.fizz = 'BUZZ';

      assert(spy.calledTwice);
      assert(spy.getCall(0).calledWith({foo: 'BAR'}));
      assert(spy.getCall(1).calledWith({fizz: 'BUZZ'}));
      assert.equal(spy.getCall(0).thisValue, model);
      assert.equal(spy.getCall(1).thisValue, model);

      model.assign({
        foo: 'bar',
        fizz: 'buzz'
      });

      assert(spy.calledThrice);
      assert(spy.getCall(2).calledWith({foo: 'bar', fizz: 'buzz'}));
      assert.equal(spy.getCall(2).thisValue, model);
    });

  });

});
