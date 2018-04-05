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
  let range = document.createRange();
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
    let js = document.createElement('script');
    let fs = document.getElementsByTagName('script')[0];
    js.src = url;
    fs.parentNode.insertBefore(js, fs);
    js.onload = resolve;
    js.onerror = reject;
  });
}


/**
 * Escapes a potentially unsafe HTML string.
 * @param {string} str A string that may contain HTML entities.
 * @return {string} The HTML-escaped string.
 */
export const escapeHtml = str => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');


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
 * tagged template literals
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
