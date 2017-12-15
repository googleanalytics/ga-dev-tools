// Copyright 2017 Google Inc. All rights reserved.
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
 * This file manages "problematic" URLs. For instance, if users are
 * creating links to Play Store URLs, they should user the Google Play
 * Url Builder (https://goo.gl/qycyHd) instead of the GA devtools app.
 *
 * See b/69681865 for more details.
 */

import React from 'react';
import {isFunction, isString, isNil, isRegExp} from 'lodash'


const matchesRegexp = regexp => url => regexp.test(url)
const matchesPattern = pattern => matchesRegexp(new RegExp(pattern, 'i'))
const matches = pattern => isRegExp(pattern) ?
	matchesRegexp(pattern) :
	matchesPattern(pattern)


/**
 * Given a domain, create a function that returns true if the domain
 * matches a given URL. The domain is matched exactly, and can optionally
 * be prepended with http:// or https://.
 *
 * This function accepts regex patterns, but escapes all . characters.
 */
const domainMatches = domain =>
	matches('^(?:https?://)?(:?' + domain.replace('.', '\\.') + ')(?:$|[/?#])')

/**
 * Given a domain suffix, create a function that returns true if the
 * domain matches a given URL. The domain is matched as a suffix; that
 * is, the domain "google.com" will match "play.google.com",
 * "mail.google.com", etc, as well as just "google.com".
 *
 * This function accepts regex patterns, but escapes all . characters.
 */
const domainSuffix = suffix =>
	domainMatches(`(?:[a-z0-9-]+.)*(?:${suffix})`)

const googlePlayBuilderUrl = "https://developers.google.com/analytics/devguides/collection/android/v4/campaigns#google-play-url-builder"
const itunesStoreBuilderUrl = "https://developers.google.com/analytics/devguides/collection/ios/v3/campaigns#url-builder"

/**
 * BADLIST
 *
 * This list is the central definition of problematic URLs. It defines
 * a series of problematic conditions, which are problably mistakes on
 * the part of the user. Each problematic item is a test, which is a
 * function that returns true if the url object is problematic, along
 * with a render, which is either a React Element or a function taking
 * a url and returning a React Element. The rendered element is used to
 * alert the user that there's a problem.
 * field
 */
const badList = [{
	name: "Play Store URL",  // This is just for reference
	test: domainSuffix('play.google.com'),
	render: <div>
		<strong>It appears you are creating a Google Play Store url.
		</strong> Please consider using the <a href={googlePlayBuilderUrl}
		target="_blank">Google Play URL Builder</a> instead!
	</div>,
}, {
	name: "iOS App Store URL",
	test: domainSuffix('itunes.apple.com'),
	render: <div>
		<strong>It appears you are creating an iOS App Store url.
		</strong> Please consider using the <a href={itunesStoreBuilderUrl}
		target="_blank">iOS Campaign Tracking URL Builder</a> instead!
	</div>,
}, {
	name: "GA Dev Tools URL",
	test: domainSuffix('ga-dev-tools.appspot.com'),
	render: <div>
		It appears that you are linking to this site, <code>ga-dev-tools.appspot.com
		</code>, instead of your own. You should put your own site's URL in
		the <strong> Website URL</strong> field, above.
	</div>,
}];

/**
 * Given a URL, use the problematic URLs list to either return a React
 * Element if the URL is problematic, or null if it's acceptable.
 *
 * @param  {string | URL} url The URL to check. Should either be a
 *     string or a URL object.
 * @return {Element | null}
 */
export default function renderProblematic(url) {
	// TODO(nathanwest): It's kind of inneficient to convert a string to
	// a URL every time. Modify the call site to pass around a URL
	// instance, and don't render it to a string until the last possible
	// moment
	for(const {test, render} of badList) {
		if(test(url)) {
			return <div className="CampaignUrlResult-alert-box">
				{isFunction(render) ? render(url) : render}
			</div>
		}
	}

	return null
}
