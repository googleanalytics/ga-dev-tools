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
import * as queryParams from '../../src/javascript/query-explorer/query-params';

describe('query-explorer', function() {
  describe('queryParams', function() {
    describe('.sanitize', function() {
      it('removes unsupported params from the object.', function() {
        let dirtyParams = {
          'ids': 'ga:1234',
          'start-date': '30daysAgo',
          'foo': 'bar',
        };
        let sanitizedParams = queryParams.sanitize(dirtyParams);
        assert.deepEqual(sanitizedParams, {
          'ids': 'ga:1234',
          'start-date': '30daysAgo',
        });
      });

      it('returns an object with the keys in order.', function() {
        let dirtyParams = {
          'segment': 'gaid::-1',
          'start-date': '30daysAgo',
          'ids': 'ga:1234',
          'max-results': '10',
          'end-date': 'yesterday',
        };
        let sanitizedParams = queryParams.sanitize(dirtyParams);
        assert.deepEqual(Object.keys(sanitizedParams), [
          'ids',
          'start-date',
          'end-date',
          'segment',
          'max-results',
        ]);
      });

      it('strips out non-string and empty string values.', function() {
        let dirtyParams = {
          'ids': 'ga:1234',
          'start-date': '',
          'end-date': null,
        };
        let sanitizedParams = queryParams.sanitize(dirtyParams);
        assert.deepEqual(sanitizedParams, {'ids': 'ga:1234'});
      });
    });
  });
});
