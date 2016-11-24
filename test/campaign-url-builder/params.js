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


import assert from 'assert';
import * as params from '../../src/javascript/campaign-url-builder/params';


describe('campaign-url-builder', () => {
  describe('params', () => {
    describe('.extractParamsFromWebsiteUrl', () => {
      it('extracts campaign params from a URL query', () => {
        let url = 'https://example.com/?utm_source=foo&utm_medium=bar';
        let ret = params.extractParamsFromWebsiteUrl(url);

        assert.equal(ret.bareUrl, 'https://example.com/');
        assert.deepEqual(ret.params, {
          utm_source: 'foo',
          utm_medium: 'bar',
        });
      });

      it('extracts campaign params from a URL fragment', () => {
        let url = 'https://example.com/#utm_source=foo&utm_medium=bar';
        let ret = params.extractParamsFromWebsiteUrl(url);

        assert.equal(ret.bareUrl, 'https://example.com/');
        assert.deepEqual(ret.params, {
          utm_source: 'foo',
          utm_medium: 'bar',
        });
      });

      it('preserves non-campaign params in a URL query', () => {
        let url = 'https://example.com/?utm_source=foo&foo=bar';
        let ret = params.extractParamsFromWebsiteUrl(url);

        assert.equal(ret.bareUrl, 'https://example.com/?foo=bar');
        assert.deepEqual(ret.params, {
          utm_source: 'foo',
        });
      });

      it('preserves non-campaign params in a URL fragment', () => {
        let url = 'https://example.com/#heading&utm_source=foo&foo=bar';
        let ret = params.extractParamsFromWebsiteUrl(url);

        assert.equal(ret.bareUrl, 'https://example.com/#heading&foo=bar');
        assert.deepEqual(ret.params, {
          utm_source: 'foo',
        });
      });

      it('favors campaign params in the fragment over the query', () => {
        let url = 'https://example.com/' +
            '?utm_source=foo&utm_medium=bar#utm_source=qux';

        let ret = params.extractParamsFromWebsiteUrl(url);

        assert.equal(ret.bareUrl, 'https://example.com/');
        assert.deepEqual(ret.params, {
          utm_source: 'qux',
          utm_medium: 'bar',
        });
      });
    });


    describe('.addParamsToUrl', () => {
      it('adds params to a URL query', () => {
        let bareUrl = 'https://example.com/?foo=bar#hash';
        let campaignParams = {utm_source: 'foo', utm_medium: 'bar'};
        let paramUrl = params.addParamsToUrl(bareUrl, campaignParams);

        assert.equal(paramUrl,
            'https://example.com/?foo=bar&utm_source=foo&utm_medium=bar#hash');
      });

      it('optionally adds params to a URL fragment', () => {
        let bareUrl = 'https://example.com/?foo=bar#hash';
        let campaignParams = {utm_source: 'foo', utm_medium: 'bar'};
        let paramUrl = params.addParamsToUrl(bareUrl, campaignParams, true);

        assert.equal(paramUrl,
            'https://example.com/?foo=bar#hash&utm_source=foo&utm_medium=bar');
      });
    });


    describe('.sanitizeParams', () => {
      it('removes non-campaign params from a query object', () => {
        let allParams = {
          utm_source: 'foo',
          utm_medium: 'bar',
          foo: 'bar',
        };
        let sanitizedParams = params.sanitizeParams(allParams);

        assert.deepEqual(sanitizedParams, {
          utm_source: 'foo',
          utm_medium: 'bar',
        });
      });

      it('ignores non-string values', () => {
        let allParams = {
          utm_source: 'foo',
          utm_medium: 1,
        };
        let sanitizedParams = params.sanitizeParams(allParams);

        assert.deepEqual(sanitizedParams, {
          utm_source: 'foo',
        });
      });

      it('optionally strips leading/trailing whitespace from values', () => {
        let allParams = {
          utm_source: '  foo ',
          utm_medium: 'bar  ',
          utm_campaign: 'baz',
        };
        let trimmedParams = params.sanitizeParams(allParams, {trim: true});

        assert.deepEqual(trimmedParams, {
          utm_source: 'foo',
          utm_medium: 'bar',
          utm_campaign: 'baz',
        });
      });

      it('optionally ignores emptry string values', () => {
        let allParams = {
          utm_source: 'foo',
          utm_medium: '',
          utm_campaign: null,
        };
        let nonEmptyParams = params.sanitizeParams(allParams, {
          removeBlanks: true,
        });

        assert.deepEqual(nonEmptyParams, {
          utm_source: 'foo',
        });
      });
    });
  });
});
