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

import {encodeQuery, promiseMemoize, cleanupingPromise} from './utils';
import {BehaviorSubject, fromEvent as rxFromEvent, merge as rxMerge} from 'rxjs';
import {
  filter as rxFilter,
  map as rxMap,
  distinctUntilChanged,
} from 'rxjs/operators';

const BITLY_TOKEN_STORAGE_KEY = 'BITLY_API_TOKEN';
const BITLY_GUID_STORAGE_KEY = 'BITLY_GUID';

// Use a global object to distinguish forbidden errors from other errors
const forbiddenError = new Error('Forbidden');

/** ********
 * This section manages subscribing to authorization state changes.
 * Ordinarily we'd just use window.addEventListener('storeage', ...), but
 * 'storage' events only fire when localStorage is touched by tabs other than
 * outselves. We therefore use RxJS to compose the two event streams: 'storage'
 * events from the DOM, and local change events fired manually from the code in
 * this manually.
 *
 * These are provided as an aid to React elements that render based on whether
 * we're authorized or not.
 **********/

// authorizationEventFromThisTab allows us to manually send auth events
const authorizationEventsFromThisTab = new BehaviorSubject(
  localStorage.getItem(BITLY_TOKEN_STORAGE_KEY)
);

const authorizationEventsFromOtherTabs = rxFromEvent(window, 'storage').pipe(
  rxFilter(event => event.storageArea === window.localStorage),
  rxFilter(event => event.key === BITLY_TOKEN_STORAGE_KEY),
  rxMap(event => event.newValue),
);

// This Observable provides a stream of authorization stream events.
// Specifically, any time the token changes or becomes null, that token
// is sent to the observable. This observatle merges events from two sources:
// 'storage' events in the DOM, and authorizationEventFromThisTab, above.
export const authorizationEvents = rxMerge(
  authorizationEventsFromOtherTabs,
  authorizationEventsFromThisTab,
).pipe(
  // Normalize tokens; make everything falsey -> null
  rxMap(token => token ? token : null),
  // Only show tokens that differ from the previous one
  distinctUntilChanged(),
);

// similar to authorizationEvents, this Observable provides a stream of
// boolean true/false values, which corrospond to isAuthorized and
// isNotAuthorized
export const isAuthorizedEvents = authorizationEvents.pipe(
  rxMap(token => token !== null),
  distinctUntilChanged(),
);

// These functions wrap localStorage.*Item, and emit events with
// authorizationEventsFromThisTab when called. We assume that no one calls
// localStorage.clear, or modifies the token outside of this file.
const getToken = () => window.getItem(BITLY_TOKEN_STORAGE_KEY);

const setToken = token => {
  if (token) {
    authorizationEventsFromThisTab.next(token);
    window.localStorage.setItem(BITLY_TOKEN_STORAGE_KEY, token);
  } else {
    removeToken();
  }
};

const removeToken = () => {
  authorizationEventsFromThisTab.next(null);
  window.localStorage.removeItem(BITLY_TOKEN_STORAGE_KEY);
};


/**
 * Accepts a long URL and returns a promise that is resolved with its shortened
 * version, using the bitly API. This function independently handles
 * authentication flow by spawning a new window to authenticate against bitly
 * if necessary, and caches tokens and other stuff to localStorage.
 *
 * This function memoizes, so calling it with the same longUrl will
 * automatically return a resolved promise with the shortened URL.
 *
 * @param {string} longUrl
 * @return {Promise} A promise resolved with the shortend URL.
 */
export const shortenUrl = promiseMemoize(async (longUrl) => {
  const bitly_api_token = getToken();

  // Attempt the API call with the stored token, but be ready to get a new
  // token and retry if it fails.
  if (bitly_api_token != undefined) {
    try {
      return await createBitlink({
        longUrl: longUrl,
        token: bitly_api_token,
        checkForbidden: true,
      });
    } catch (e) {
      // If it wasn't a forbidden error, return it to the caller. Otherwise,
      // it's possible we have a bad token and should retry with a fresh one.
      if (e !== forbiddenError) {
throw e;
}

      // Hmm. I guess the token was bad. Clear the saved stuff before proceeding.
      removeToken();
      localStorage.removeItem(BITLY_GUID_STORAGE_KEY);
    }
  }

  // Okay, so we have no token. Send the user to the bitly oauth url.

  // This client ID should be attached as a global by the server template
  // renderer. This way we don't have to make a whole round trip to an API to
  // get it. This currently happens inside of lib/template.py:render, so it's
  // always available.
  const bitly_client_id = window.BITLY_CLIENT_ID;
  if (!bitly_client_id) {
throw new Error('No OAuth client ID available. Make sure to attach it as a global in the server!');
}

  // Initiate OAuth flow. Spawn a new window, which sends the user to bitly's
  // auth page. That will redirect us to /url-shorten/auth-callback, which
  // will get an authentication token, then send us a message via postMessage
  // with the token.
  //
  // We can't use try-finally here because the various APIs we're using (
  // addEventListener, timers, etc) aren't promisified or awaitable, so we have
  // to wrap them up in a promise abstraction that cleans up after itself.
  const {token} = await cleanupingPromise((resolve, reject, cleanup) => {
    // Attach a listener that will await a message via postMessage
    const messageListener = event => {
      if (event.origin === window.location.origin && event.source === childWindow) {
        const data = event.data;
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      }
    };
    window.addEventListener('message', messageListener, {once: true});
    cleanup(() => window.removeEventListener('message', messageListener));

    const auth_url = 'https://bitly.com/oauth/authorize' + encodeQuery({
      client_id: bitly_client_id,
      // The auth callback does about half the work here: it receieves an
      // authorization code, converts it into a token, then sends the token
      // back to us. This happens server side because it requires the
      // client_secret, which we don't want to share with our users.
      redirect_uri: window.location.origin + '/bitly-api-token-handler/',
    });
    // Open a new window to do authentication.
    const childWindow = window.open(auth_url, '_blank');
    if (childWindow == null) {
throw new Error('Failed open new window for authorizing bitly. Are you blocking popups?');
}

    // Close the window as soon as auth flow completes.
    cleanup(() => childWindow.close());

    // If the user closes the window, that's an error
    const intervalHandle = window.setInterval(() => {
      if (childWindow.closed) {
reject(new Error('Authorization window closed before authorization was completed'));
}
    }, 1000);
    cleanup(() => window.clearInterval(intervalHandle));

    // If the user takes too long, that's an error.
    const timeoutHandle = window.setTimeout(() => {
      reject(new Error('Timed out waiting for authorization'));
    }, 1000 * 60 * 5);
    cleanup(() => window.clearTimeout(timeoutHandle));
  });

  // We have a token! Save it to localStorage, then retry the API call. At this
  // point, all errors should just be sent to the client; we've done all we can
  // to make it successful

  setToken(token);

  return await createBitlink({
    longUrl: longUrl,
    token: token,
    checkForbidden: false,
  });
});

// Generic bitly v4 API calls. Makes a request to https://api-ssl.bitly.com/v4/{endpoint},
// using the options. If payload is given, it is JSON encoded and used as the
// body, and the content-type header is set. Uses token for authentication.
//
// If a payload is given and no method is set, the method is POST.
//
// This function uses fetch api, so all options are as to the fetch() function.
//
// HTTP errors are rejected with a summary message; otherwise, the response
// JSON payload is returned. If checkForbidden is true, 403 errors cause the
// forbiddenError object to be returned (as a rejection); this allows for
// easily detecting this case for OAuth flow.
const bitlyApiFetch = async ({token, endpoint, options, payload=undefined, checkForbidden=false}) => {
  options = options || {};

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  options = {...options, headers};

  if (payload !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(payload);
    options.method = options.method || 'POST';
  }

  const url = `https://api-ssl.bitly.com/v4/${endpoint.replace(/^\//, '')}`;
  const response = await fetch(url, options);

  if (checkForbidden && response.status === 403) {
throw forbiddenError;
}

  const body = await response.json();

  if (!response.ok) {
throw new Error(`Error ${response.code} from ${url}: ${body.message}`);
}

  return body;
};

/**
 * Attempt to create a short URL by POSTing to the bitly API. Return the
 * created short link. The bitly create-link API requires a group, and doesn't
 * have any notion of a default group, so we also look up a group to use.
 */
const createBitlink = ({longUrl, token, checkForbidden}) =>
  getBitlyGroup({token, checkForbidden})
  .then(guid => createBitlinkCall({longUrl, token, checkForbidden, guid}));


/**
 * Create a bitlink with the bitly API.
 */
const createBitlinkCall = ({longUrl, token, guid, checkForbidden}) =>
  bitlyApiFetch({
    token: token,
    endpoint: '/shorten',
    checkForbidden: checkForbidden,
    payload: {
      long_url: longUrl,
      group_guid: guid,
    },
  }).then(data => data.link);


/**
 * Get the user's "default" bitly group. This group is cached as in localStorage
 * using BITLY_GUID_STORAGE_KEY, and looked up with that key. If the key doesn't
 * exist, use the bitly API to fetch the group.
 */
const getBitlyGroup = ({token, checkForbidden}) => {
  let guid = localStorage.getItem(BITLY_GUID_STORAGE_KEY);
  return guid ?
    Promise.resolve(guid) :
    fetchBitlyGroup({token, checkForbidden}).then(guid => {
      localStorage.setItem(BITLY_GUID_STORAGE_KEY, guid);
      return guid;
    });
};

// Get the user's bitly group. Users can have more than one group, and
// we don't really have a good way to identify which one is the "primary",
// so for now we just return the first one in the array.
// TODO(nathanwest): that's almost certainly not the behavior we actually
// want; fix it.
const fetchBitlyGroup = ({token, checkForbidden}) =>
  bitlyApiFetch({
    token: token,
    endpoint: '/groups',
    checkForbidden: checkForbidden,
  }).then(data => {
    const groups = data.groups;
    if (groups.length > 0) return groups[0].guid;
    else throw new Error('bitly user has no associated groups!');
  });
