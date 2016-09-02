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
 * Returns a promise that is resolved after the specified amount of time
 * has passed.
 * @param {number} amount The amount of time to sleep in milliseconds.
 * @return {Promise}
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
  } catch(e) {}

  window.getSelection().removeAllRanges();
  return success;
}


/**
 * Takes a script URL and return a promise that resolves once the script has
 * been loaded on the page or rejects if the load fails.
 * @param {string} url
 * @return {Promise}
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

