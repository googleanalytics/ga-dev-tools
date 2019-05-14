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

import {encodeQuery, cleanupingPromise} from './utils';
import {
  BehaviorSubject,
  fromEvent as rxFromEvent,
  merge as rxMerge,
} from 'rxjs';
import {
  filter as rxFilter,
  map as rxMap,
  distinctUntilChanged,
} from 'rxjs/operators';

const BITLY_TOKEN_STORAGE_KEY = 'BITLY_API_TOKEN';
const BITLY_MULTIPLE_GUID_STORAGE_KEY = 'BITLY_MANY_GROUPS';
const BITLY_CACHE_KEY = 'BITLY_CACHE';

// Use a global object to distinguish known errors from other errors
const forbiddenError = new Error('Forbidden');
const noTokenError = new Error('No token provided');

/**
 * This section manages subscribing to authorization state changes.
 * Ordinarily we'd just use window.addEventListener('storage', ...), but
 * 'storage' events only fire when localStorage is touched by tabs other than
 * outselves. We therefore use RxJS to compose the two event streams: 'storage'
 * events from the DOM, and local change events fired manually from the code in
 * this file.
 *
 * These are provided as an aid to React elements that render based on whether
 * we're authorized or not.
 */

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
// is sent to the observable. This observable merges events from two sources:
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

/**
 * Get the stored bitly authorization token.
 *
 * @return {string?} The currently cached authorization. Returns null if not
 *   set or if it's a falsey value.
 */
const getToken = () => {
  const token = window.localStorage.getItem(BITLY_TOKEN_STORAGE_KEY);
  return token ? token : null;
};

const setToken = token => {
  if (token) {
    window.localStorage.setItem(BITLY_TOKEN_STORAGE_KEY, token);
    authorizationEventsFromThisTab.next(token);
  } else {
    removeToken();
  }
};

const removeToken = () => {
  window.localStorage.removeItem(BITLY_TOKEN_STORAGE_KEY);
  authorizationEventsFromThisTab.next(null);
};

const clearState = () => {
  removeToken();
  localStorage.removeItem(BITLY_MULTIPLE_GUID_STORAGE_KEY);
  localStorage.removeItem(BITLY_CACHE_KEY);
};

const BITLY_AUTH_WINDOW_TIMEOUT = 1000 * 60 * 15;
const BITLY_AUTH_PREMATURE_CLOSE_INTERVAL = 1000;

/**
 * Accepts a long URL and returns a promise that is resolved with its shortened
 * version, using the bitly API. This function independently handles
 * authentication flow by spawning a new window to authenticate against bitly
 * if necessary, and caches tokens and other stuff to localStorage.
 *
 * This function memoizes its results in localStorage. This cache is reset
 * whenever the function puts the user through Authorization flow.
 *
 * @param {string} longUrl The URL to shorten
 * @param {string} bitlyGuid The bitly group id in which to create the group.
 *   If not provided, the user's default group is used.
 * @return {Promise} A promise resolved with the shortend URL.
 */
export const shortenUrl = async (longUrl, bitlyGuid) => {
  // Attempt the API call with the stored token, but be ready to get a new
  // token and retry if it fails.
  try {
    return await createBitlink({
      longUrl: longUrl,
      guid: bitlyGuid,
      checkForbidden: true,
    });
  } catch (e) {
    if (e === forbiddenError || e === noTokenError) {
      // Hmm. I guess the token was bad. Clear the saved stuff before
      // proceeding.
      clearState();
    } else {
      // If it was a real error, throw it to the caller
      throw e;
    }
  }

  // Okay, so we have no token. Send the user to the bitly oauth url.

  // This client ID should be attached as a global by the server template
  // renderer. This way we don't have to make a whole round trip to an API to
  // get it. This currently happens inside of lib/template.py:render, so it's
  // always available.
  const bitlyClientId = window.BITLY_CLIENT_ID;
  if (!bitlyClientId) {
    throw new Error(
        'No OAuth client ID available. Make sure to attach it as a ' +
      'global in the server! This is a developer error, not a user error.'
    );
  }

  // Initiate OAuth flow. Spawn a new window, which sends the user to bitly's
  // auth page. That will redirect us to /url-shorten/auth-callback, which
  // will get an authentication token, then send us a message via postMessage
  // with the token.
  //
  // We can't use try-finally here because the various APIs we're using (
  // addEventListener, timers, etc) aren't promisified or awaitable, so we have
  // to wrap them up in a promise abstraction that cleans up after itself.
  //
  // TODO(nathanwest): RxJS was a relatively late addition to the URL shortener
  // design, but now that we have it, see if any of this cleanup stuff can be
  // more easily or cleanly expressed using that library.
  const {token} = await cleanupingPromise((resolve, reject, cleanup) => {
    // Attach a listener that will await a message via postMessage
    const messageListener = event => {
      if (
        event.origin === window.location.origin &&
        event.source === childWindow
      ) {
        const data = event.data;
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      }
    };
    window.addEventListener('message', messageListener);
    cleanup(() => window.removeEventListener('message', messageListener));

    const authUrl = 'https://bitly.com/oauth/authorize' + encodeQuery({
      client_id: bitlyClientId,
      // The auth callback does about half the work here: it receieves an
      // authorization code, converts it into a token, then sends the token
      // back to us. This happens server side because it requires the
      // client_secret, which we don't want to share with our users.
      redirect_uri: window.location.origin + '/bitly-api-token-handler/',
    });
    // Open a new window to do authentication.
    const childWindow = window.open(authUrl, '_blank');
    if (childWindow == null) {
      throw new Error(
          'Couldn\'t open bit.ly authorization page. ' +
        'Are you blocking popups?'
      );
    }

    // Close the window as soon as auth flow completes.
    cleanup(() => childWindow.close());

    // If the user closes the window, that's an error
    const intervalHandle = window.setInterval(() => {
      if (childWindow.closed) {
        reject(new Error(
            'Authorization window closed before authorization was completed'
        ));
      }
    }, BITLY_AUTH_PREMATURE_CLOSE_INTERVAL);
    cleanup(() => window.clearInterval(intervalHandle));

    // If the user takes too long, that's an error.
    const timeoutHandle = window.setTimeout(() => {
      reject(new Error('Timed out waiting for authorization'));
    }, BITLY_AUTH_WINDOW_TIMEOUT);
    cleanup(() => window.clearTimeout(timeoutHandle));
  });

  // We have a token! Save it to localStorage, then retry the API call. At this
  // point, all errors should just be sent to the client; we've done all we can
  // to make it successful

  setToken(token);

  return await createBitlink({
    longUrl: longUrl,
    guid: bitlyGuid,
    checkForbidden: false,
  });
};

// Generic bitly v4 API calls. Makes a request to
// https://api-ssl.bitly.com/v4/{endpoint}, using the options. If payload is
// given, it is JSON encoded and used as the body, and the content-type header
// is set. Uses token for authentication. If a payload is given and no method
// is set, the method is POST. Additional HTTP options can be passed in
// `options`; these are merged with the other parameters and passed as the
// second argument to window.fetch()
//
// HTTP errors are rejected with a summary message; otherwise, the response
// JSON payload is returned. If checkForbidden is true, 403 errors cause the
// forbiddenError object to be returned (as a rejection); this allows for
// easily detecting this case for OAuth flow.
export const bitlyApiFetch = async ({
  endpoint,
  token=null,
  options={},
  payload=undefined,
  checkForbidden=false,
}) => {
  token = token == null ? getToken() : token;
  if (!token) {
    throw noTokenError;
  }

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
 * created short link.
 *
 * The bitly group `guid` is used. If not given, the user's default group is
 * looked up.
 *
 * This function caches its results in localStorage, though it doesn't cache
 * the default group.
 *
 * @return {string} The shortened link.
 */
const createBitlink = async ({longUrl, guid=null, token, checkForbidden}) => {
  const realGuid = guid == null ?
    (await getBitlyGroup({token, checkForbidden})) :
    guid;

  const cache = JSON.parse(localStorage.getItem(BITLY_CACHE_KEY)) || {};
  const groupCache = cache[realGuid] || {};
  const cachedLink = groupCache[longUrl];

  if (cachedLink) {
    return cachedLink;
  }

  const link = await createBitlinkCall({
    longUrl,
    token,
    checkForbidden,
    guid: realGuid,
  });

  groupCache[longUrl] = link;
  cache[realGuid] = groupCache;

  localStorage.setItem(BITLY_CACHE_KEY, JSON.stringify(cache));

  return link;
};


// Create a bitlink with the bitly API
const createBitlinkCall = ({longUrl, token, guid, checkForbidden}) =>
  bitlyApiFetch({
    token: token,
    endpoint: '/shorten',
    checkForbidden: checkForbidden,
    payload: {
      long_url: longUrl,
      group_guid: guid,
    },
  })
      .catch(error => {
        // TODO(nathanwest): use a more structured error type
        if (
          error.message.includes('INVALID_ARG_LONG_URL') &&
      !longUrl.match(/^[a-zA-Z]+:\/\//)
        ) {
          throw new Error(
              'Can\'t shorten URLs that don\'t have a scheme. ' +
        'Add \'http://\' or \'https://\' to the beginning of your URL.');
        } else {
          throw error;
        }
      })
      .then(data => data.link);


// Get the authorized user's default bitly group.
const getBitlyGroup = ({token, checkForbidden}) =>
  bitlyApiFetch({
    token: token,
    endpoint: '/user',
    checkForbidden: checkForbidden,
  }).then(data => data.default_group_guid);
