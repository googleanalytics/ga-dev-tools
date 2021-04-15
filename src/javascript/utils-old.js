// Copyright 2016 Google Inc. All rights reserved.
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

import escapeHtml from 'lodash/escape';
import map from 'lodash/map';

/**
 * Awaits for a specified amount of time.
 * @param {number} amount The amount of time to sleep in milliseconds.
 * @return {Promise} A promise that is resolved after the specified amount of
 *    time has passed.
 */
export function sleep(amount) {
  return new Promise(function(resolve) {
    setTimeout(resolve, amount);
  });
}


/**
 * Copies the text content from the passed HTML element.
 * @param {HTMLElement} element The element to copy text from.
 * @return {boolean} true if the copy action was successful.
 */
export function copyElementText(element) {
  let success = false;
  const range = document.createRange();
  range.selectNode(element);

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  try {
    success = document.execCommand('copy');
  } catch (e) {
    // No action.
  }

  window.getSelection().removeAllRanges();
  return success;
}


/**
 * Takes a script URL.
 * @param {string} url
 * @return {Promise} A promise that resolves once the script has been loaded
 *     on the page or rejects if the load fails.
 */
export function loadScript(url) {
  return new Promise((resolve, reject) => {
    const js = document.createElement('script');
    const fs = document.getElementsByTagName('script')[0];
    js.src = url;
    fs.parentNode.insertBefore(js, fs);
    js.onload = resolve;
    js.onerror = reject;
  });
}

/**
 * Returns true if a string is null, undefined, or an empty string.
 * Returns false for non strings.
 *
 * @param {object} value to check.
 * @return {boolean} true if the argument is null, undefined, or an empty
 *     string.
 */
const strIsEmpty = value => value == null || value === '';


/**
 * Template interface for creating HTML snippets safely. Uses the tagged
 * template syntax:
 *
 *     text = "x > y"
 *     snippet = tagHtml`<span>${text}</span>`
 *     // snippet === <span>x &gt y</span>
 *
 * The HTML in the template will be preserved, but all substitutions will
 * be escaped.
 *
 * See https://mzl.la/2EnDB7Q for details on the function signature for
 * tagged template literals.
 *
 * Some safety notes: in order to prevent additional vulnerability, this
 * function should never be used to insert template content into javascript.
 * Additionally, do not use unquted attributes (such as
 * tagHtml`<div class=${cls}></div>`).
 *
 * @param  {string[]} rawParts The literal text between each substitution
 *     of the template string.
 * @param  {...object} substitutions The value of each substituton, after
 *     evaluation, but not coerced to a string. These are interleaved with
 *     the rawParts to produce the final string.
 * @return {string} An HTML snippet, where all the substitutions have been
 *     safely HTML escaped.
 */
export const tagHtml = (rawParts, ...substitutions) => {
  const result = [];

  rawParts.forEach((raw, index) => {
    const substitution = substitutions[index];
    if (!strIsEmpty(raw)) result.push(raw);
    if (!strIsEmpty(substitution)) result.push(escapeHtml(substitution));
  });

  return result.join('');
};


/**
 * A class for thowing errors that can be easily turned into UI alerts.
 */
export class UserError extends Error {
  /**
   * @param {{title: (string), message: (string)}} arg1
   */
  constructor({title, message}) {
    super(message);
    this.title = title;
  }
}

/**
 * Given an object containing key-value pairs, produce a URL encodes query
 * string. This string uses the ?key=value&key2=value2 syntax. If the provided
 * object is null or empty, return an empty string, otherwise return a string
 * with a prepended ?
 *
 * @param {Object<string, string>} query The query to encode. Should contain
 *   key-value data.
 * @return {string} The encoded query. Includes a prepended ? if the query is
 *   not empty.
 */
export const encodeQuery = query => {
  if (query) {
    const encoded = map(query, (value, key) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    ).join('&');
    return encoded ? `?${encoded}` : '';
  } else {
    return '';
  }
};

// Given a unary function which returns a promise, wrap that function to
// memoize the result. This memoize is keyed on the function's argument
// (currently only single-argument functions are supported). The memoize fails
// if the promise rejects, and multiple concurrent calls to an ongoing promise
// will all return the same promise.
export const promiseMemoize = func => {
  // This is a mapping of key => Promise. storing the promise directly
  // simplifies our implementation, since we just return it on a cache hit.
  const cache = new Map();

  return argument => {
    const result = cache.get(argument);
    if (result != undefined) {
      return result;
    }

    const promise = new Promise(res => res(func(argument)))
        .catch(error => {
          cache.delete(argument);
          throw error;
        });
    cache.set(argument, promise);
    return promise;
  };
};

/**
 * Create a promise that cleans up after itself. This is the same as a regular
 * promise, but the executor function is passed an additonal function called
 * cleanup. Cleanup can be called to add cleanup handlers to the promise.
 * When the executor promise is fullfilled in any way, all the cleanup handlers
 * are called in an unspecified order. Returned values from cleanups are
 * ignored, but returned promises are awaited before the outer promise resolved
 * with the same value as the inner promise. Any execeptions or rejected
 * promises in cleanup handlers are propogated to the outer promise as a
 * rejection.
 *
 * @param  {function(resolve, reject, cleanup)} executor An executor function,
 *   similar to what would be passed to new Promise(). It is given a third
 *   argument, cleanup, which it may call 0 or more times to add cleanup
 *   functions. These cleanup functions are all executed before the promise
 *   resolves. cleanup() must be called during the executor; it cannot be
 *   called asynchronously (mostly due to issues with consistent error
 *   propogation)
 * @return {Promise} A new Promise. Will run to completion, and additionally
 *   run (and resolve) all cleanup handlers before resolving itself.
 */
export const cleanupingPromise = executor => {
  const cleanups = [];
  let addCleanup = cleaner => {
    cleanups.push(cleaner);
  };

  const innerPromise = new Promise((resolve, reject) =>
    executor(resolve, reject, cleaner => {
      addCleanup(cleaner);
    })
  );

  addCleanup = () => {
    throw new Error('Can\'t add new cleanup handlers asynchronously');
  };

  return Promise.all(cleanups.map(
      cleanup => innerPromise.finally(() => cleanup())
  )).then(() => innerPromise);
};
