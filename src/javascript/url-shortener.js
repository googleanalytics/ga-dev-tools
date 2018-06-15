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


/* global gapi */


import once from 'lodash/once'

import {loadScript} from './utils';


const bitly_client_id_promise = new Promise((resolve, reject) => {
  const key = window.BITLY_CLIENT_ID
  if(key) {
    resolve(key)
  } else {
    reject(new Error("No BITLY_CLIENT_ID found! Need to attach it to window as a global"))
  }
})


const urlMapCache = new Map();

// Use a global object to distinguish forbidden errors from other errors
const forbiddenError = new Error("Forbidden")

/**
 * Accepts a long URL and returns a promise that is resolved with its shortened
 * version. This function loads the urlshortener API if it's not loaded, but
 * the library is only ever loaded once. Long URLs are also cached, so multiple
 * requests for the same URL are never made.
 * @param {string} longUrl
 * @return {Promise} A promise resolved with the shortend URL.
 */
export async function shortenUrl(longUrl) {
  const cachedUrl = urlMapCache.get(longUrl)
  if(cachedUrl != undefined)
    return cachedUrl

  const bitly_api_token = localStorage.getItem("BITLY_API_TOKEN")
  if(bitly_api_token != undefined) {
    try {
      return await createBitlink(longUrl, bitly_api_token)
    } catch(e) {
      // If it wasn't a forbidden error, return it to the caller. Otherwise,
      // it's possible we have a bad token and should retry with a fresh one.
      if(e !== forbiddenError)
        throw e
    }
  }
}

const acceptableOrigin = origin => {
  throw new Error("NOT IMPLEMENTED")
}

// Like addEventListener, but returns a function to clear the listener. Makes
// it more amenable to inline arrow functions.
const addClearableListener = (event, listener) => {
  window.addEventListener(event, listener)
  return () => window.removeEventListener(event, listener)
}

/**
 * Create a promise that cleans up after itself. This is the same as a regular
 * promise, but the executor function is passed an additonal function called
 * cleanup. Cleanup can be called to add cleanup handlers to the promise.
 * When the promise is fullfilled in any way, all the cleanup handlers are
 * called in reverse order. Return values are ignored, but exceptions or rejected
 * promises are propogated outwards.
 *
 * Cleanup handlers must be added during the executor function. They cannot be
 * added asynchronously. If you need asynchronous cleanup, use a nested
 * cleanuping promise.
 *
 * @param  {[type]} executor [description]
 * @return {[type]}          [description]
 */
const cleanupingPromise = executor => {
  const cleanups = []
  let addCleanup = cleaner => { cleanups.push(cleaner) }

  const promise = new Promise((resolve, reject) =>
    executor(resolve, reject, cleaner => { addCleanup(cleaner) })
  )

  addCleanup = () => { throw new Error("Can't add new cleanup handlers asynchronously")}

  return cleanups.reduceRight((p, cleanup) => p.finally(cleanup), promise)


}


// TODO(nathanwest): replace this noise with a bluebird disposer

// Spawn a window and wait for a message from it. Reject if the window is closed
// with no message.
const spawnWindow = (url, features) => cleanupingPromise((resolve, reject, cleanup) => {
  cleanup(addClearableListener('message', event => {
    if(acceptableOrigin(event.origin) && event.source === childWindow)
      resolve(event.data)
  }))

  const childWindow = window.open(url, "_blank", features)
  if(childWindow == null)
    throw new Error(`Failed to open '${url}' in a new window`)
  cleanup(() => childWindow.close())

  const intervalHandle = window.setInterval(() => {
    if(window.closed)
      reject(new Error("Window was closed before sending a message"))
  }, 1000)
  cleanup(() => window.clearInterval(intervalHandle))
})

  return promise.finally(() => {
    if(childWindow)
      childWindow.close()
    clearListener()
    window.clearInterval(intervalHandle)
  })
}

new Promise((resolve, reject) => {
  const windowHandle = window.open(url, "_blank", features)
  if(windowHandle == null)
    reject(new Error(`Failed to open '${url}' in a new window`))



  const closeHandler = window.setInterval(() => {
    // Check for window closed
  }, 1000)
})


/**
 * Attempt to create a short URL by POSTing to the bitly API
 */
const createBitlink = (longUrl, token) =>
  fetch("https://api-ssl.bitly.com/v4/shorten", {
    body: JSON.stringify({ long_url: longUrl }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `bearer ${token}`,
    }
  }).then(response => {
    if(!response.ok)
      throw (response.status === 403 ? forbiddenError : response)

    return response.json()
  }).then(responseBlob => responseBlob.link)
