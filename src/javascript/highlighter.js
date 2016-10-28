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


/* global $ */


import hljs from 'highlight.js/lib/highlight';


hljs.registerLanguage(
    'xml', require('highlight.js/lib/languages/xml'));

hljs.registerLanguage(
    'javascript', require('highlight.js/lib/languages/javascript'));

hljs.registerLanguage(
    'json', require('highlight.js/lib/languages/json'));

hljs.registerLanguage(
    'python', require('highlight.js/lib/languages/python'));


/**
 * Adds highlight.js syntax highlighting to all elements on the page matching
 * the passed selector.
 * @param {string} selector
 */
export function highlightAll(selector) {
  $(selector).each(function() {
    hljs.highlightBlock(this);
  });
}


/**
 * Adds highlight.js syntax highlighting to a string of code.
 * @param {{lang: (string), code: (string)}} opts
 * @return {string} The highlighted code string, it can be used as the
 *     `innherHTML` of an element.
 */
export function highlight({lang, code}) {
  return hljs.highlight(lang, code).value;
}
