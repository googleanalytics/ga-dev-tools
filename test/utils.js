// Copyright 2018 Google Inc. All rights reserved.
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

// TODO - Add these tests back in once we have typescript supported in our
// testing pipeline.

/* import {expect, use} from 'chai';
 * import chaiAsPromised from 'chai-as-promised';
 * import promiseFinally from 'promise.prototype.finally'; */

/* use(chaiAsPromised);
 * promiseFinally.shim();
 *
 * import {
 *   tagHtml,
 *   encodeQuery,
 *   promiseMemoize,
 *   cleanupingPromise,
 * } from '../src/javascript/utils';
 *
 * // Wrap a function to keep track of how often it is called
 * const counted = func => {
 *   const wrapper = function(...args) {
 *     wrapper.count += 1;
 *     return func.apply(this, args);
 *   };
 *   wrapper.count = 0;
 *   return wrapper;
 * };
 *
 * describe('utils', () => {
 *   describe('HTML escaping', () => {
 *     const unescapedSampleText =
 *       '<div class="hello">abc &nbsp; def</div>';
 *     const correctlyEscapedSampleText =
 *       '&lt;div class=&quot;hello&quot;&gt;abc &amp;nbsp; def&lt;/div&gt;';
 *
 *     describe('tagHtml', () => {
 *       it('should leave template HTML untouched', () => {
 *         // Tester's note: make sure the template is the same as
 *         // unescapedSampleText
 *         const tagged = tagHtml`<div class="hello">abc &nbsp; def</div>`;
 *
 *         expect(tagged).to.equal(unescapedSampleText);
 *       });
 *
 *       it('should escape substitutions, but leave template content', () => {
 *         const tagged =
 *           tagHtml`<div class="outer">${unescapedSampleText}</div>`;
 *         const expected =
 *           `<div class="outer">${correctlyEscapedSampleText}</div>`;
 *
 *         expect(tagged).to.equal(expected);
 *       });
 *     });
 *   });
 *
 *   describe('encodeQuery', () => {
 *     it('should return an empty string given a falsey value', () => {
 *       expect(encodeQuery(null)).to.equal('');
 *     });
 *
 *     it('should return an empty string given an empty object', () => {
 *       expect(encodeQuery({})).to.equal('');
 *     });
 *
 *     it('should return an encoded query string', () => {
 *       // Order is arbitrary, so make sure to test for all possibilites
 *       expect(encodeQuery({
 *         key1: 'value1',
 *         key2: 'value2',
 *       })).to.be.oneOf([
 *         '?key1=value1&key2=value2',
 *         '?key2=value2&key1=value1',
 *       ]);
 *     });
 *
 *     it('should safely escape special characters in keys and values', () => {
 *       expect(encodeQuery({
 *         '/key': '?value',
 *         '=key': '&value',
 *       })).to.be.oneOf([
 *         '?%2Fkey=%3Fvalue&%3Dkey=%26value',
 *         '?%3Dkey=%26value&%2Fkey=%3Fvalue',
 *       ]);
 *     });
 *   });
 *
 *   describe('promiseMemoize', () => {
 *     it('should cache promise results', () => {
 *       const makePromise = counted(value => Promise.resolve(value));
 *       const memoized = promiseMemoize(makePromise);
 *
 *       return Promise.all([
 *         expect(memoized(1)).to.eventually.equal(1),
 *         expect(memoized(1)).to.eventually.equal(1),
 *         expect(memoized(2)).to.eventually.equal(2),
 *         expect(memoized(2)).to.eventually.equal(2),
 *       ]).then(() =>
 *         expect(makePromise.count).to.equal(2),
 *       );
 *     });
 *
 *     it('should not cache errors', () => {
 *       const makePromise = counted(err => Promise.reject(err));
 *       const memoized = promiseMemoize(makePromise);
 *       // Make sure to do these in strict sequence, as memoized DOES cache
 *       // promises that aren't in a resolved state yet
 *
 *       return Promise.resolve()
 *           .then(() => expect(memoized(1)).to.be.rejectedWith(1))
 *           .then(() => expect(memoized(1)).to.be.rejectedWith(1))
 *           .then(() => expect(memoized(2)).to.be.rejectedWith(2))
 *           .then(() => expect(memoized(2)).to.be.rejectedWith(2))
 *           .then(() => expect(makePromise.count).to.equal(4));
 *     });
 *     // Needs test: it should cache in-progress promises
 *   });
 *
 *   describe('cleanupingPromise', () => {
 *     it('should run cleanup functions when resolved', () => {
 *       let value = 0;
 *
 *       return cleanupingPromise((resolve, reject, cleanup) => {
 *         value += 1;
 *         cleanup(() => value -= 1);
 *         expect(value).to.equal(1);
 *
 *         value += 1;
 *         cleanup(() => value -= 1);
 *         expect(value).to.equal(2);
 *         resolve(null);
 *       }).then(() => {
 *         expect(value).to.equal(0);
 *       });
 *     });
 *
 *     it('should run cleanup functions if an error is thrown', () => {
 *       let value = 0;
 *
 *       return cleanupingPromise((resolve, reject, cleanup) => {
 *         cleanup(() => value += 1);
 *         cleanup(() => value += 1);
 *         throw new Error();
 *       }).catch(e =>
 *         expect(value).to.equal(2)
 *       );
 *     });
 *
 *     it('should not allow asynchronous cleanups', () => {
 *       let value = 0;
 *       return cleanupingPromise((resolve, reject, cleanup) => {
 *         cleanup(() => value += 1);
 *         resolve(Promise.resolve().then(() =>
 *           expect(() => cleanup(() => value += 1)).to.throw()
 *         ));
 *         cleanup(() => value += 1);
 *         cleanup(() => value += 1);
 *       }).then(() =>
 *         expect(value).to.equal(3)
 *       );
 *     });
 *
 *     it('should propogate cleanup errors', () => {
 *       return expect(cleanupingPromise((resolve, reject, cleanup) => {
 *         cleanup(() => {});
 *         cleanup(() => {
 *           throw new Error();
 *         });
 *         cleanup(() => {});
 *         resolve('SUCCESS');
 *       })).to.be.rejected;
 *     });
 *
 *     // Needs test:
 *     // - it should wait for cleanup promises
 *     // - it shoudl execute all cleanups concurrently, if they're promises
 *   });
 * }); */
