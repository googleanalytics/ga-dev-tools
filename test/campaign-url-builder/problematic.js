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

import { expect } from 'chai'
import ReactTestUtils from 'react-dom/test-utils';
import renderProblematic from
  '../../src/javascript/campaign-url-builder/components/problematic.js'

// Given a basic domain, test the domain for all combinations of
// leading protocol, subdomain, path, query, and fragment.
const thoroughlyTestDomain = (domain, test) =>
  ["", "http://", "https://"].forEach(proto =>
    ["", "www.", "play.google.com."].forEach(subdomain =>
      ["", "/", "/object/path", "/trailing/slash/"].forEach(path =>
        ["", "?utm_content=test"].forEach(query =>
          ["", "#fragment"].forEach(fragment =>
            test(`${proto}${subdomain}${domain}${path}${query}${fragment}`)
          )
        )
      )
    )
  )

describe('campaign-url-builder', () => {
  describe('renderProblematic', () => {
    it("does not flag ordinary URLs as problematic", () => {
      ['example.com', 'mail.google.com']
      .forEach(domain => {
        thoroughlyTestDomain(domain, url => {
          const renderResult = renderProblematic(url)
          expect(renderResult)
            .to.be.an('object')
            .that.deep.equals({element: null, eventLabel: null})
        })
      })
    })

    it("returns a React element and analytics alert for problematic URLs",
      () => {
        [
          {domain: 'play.google.com', event: "Google Play Store"},
          {domain: 'itunes.apple.com', event: "iOS App Store"},
          {domain: 'ga-dev-tools.appspot.com', event: "GA Dev Tools"},
        ].forEach(({domain, event}) => {
          thoroughlyTestDomain(domain, url => {
            const renderResult = renderProblematic(url)
            expect(renderResult)
              .to.be.an('object')
              .that.includes({eventLabel: event})
              .and.has.property('element')
                .that.satisfies(ReactTestUtils.isElement)
            // TODO(nathanwest): Test that the returned React element includes
            // a url to the correct url builder. This requires introspecting
            // React elements, which I don't know how to do yet.
          })
        })
      }
    )

    describe('performance', () => {
      // TODO(nathanwest): during development, there was a major
      // performance issue related to a pathological regex. Test that
      // it doesn't take 3 seconds to match a 10 character string.
      // Need to review JS performance testing libraries.
    })
  })
})
