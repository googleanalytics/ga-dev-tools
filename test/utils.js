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


import {expect} from 'chai';
import {escapeHtml, tagHtml} from '../../src/javascript/utils.js';

describe('html escaping', () => {
  const unescapedSampleText =
    '<div class="hello">abc &nbsp; def</div>';
  const correctlyEscapedSampleText =
    '&lt;div class=&quot;hello&quot;&gt;abc &amp;nbsp; def&lt;/div&gt;';

  describe('escapeHtml', () => {
    it('should leave regular text untouched', () => {
      expect(escapeHtml('Hello, World!'))
        .to.equal('Hello, World!');
    });

    it('should replace special characters with escaped versions', () => {
      expect(escapeHtml(unescapedSampleText))
        .to.equal(correctlyEscapedSampleText);
    });

    it('should not attempt to preserve user-escapes like &nbsp', () => {
      expect(escapeHtml(correctlyEscapedSampleText))
        .to.not.equal(correctlyEscapedSampleText);
    });
  });

  describe('tagHtml', () => {
    it('should leave template HTML untouched', () => {
      // Tester's note: make sure the template is the same as
      // unescapedSampleText
      const tagged = tagHtml`<div class="hello">abc &nbsp; def</div>`;

      expect(tagged).to.equal(unescapedSampleText);
    });

    it('should escape substituted content', () => {
      const tagged = tagHtml`<div class="outer">${unescapedSampleText}</div>`;
      const expected = `<div class="outer">${correctlyEscapedSampleText}</div>`;

      expect(tagged).to.equal(expected);
    });
  });
});
