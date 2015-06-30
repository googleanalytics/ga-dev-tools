// Copyright 2015 Google Inc. All rights reserved.
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


export default {

  /**
   * Returns true if the browser supports copying to the clipboard.
   * @return {boolean}
   */
  copyToClipboard: (function() {

    let isCopySupported;

    return function() {
      return isCopySupported || (isCopySupported =

        // Firefox has a false positive on the
        // `queryCommandSupported('copy')` method, so at the moment we simply
        // have to exclude it. Once Firefox enables true support, remove this
        // conditional.
        // http://goo.gl/x4jcS
        typeof InstallTrigger === 'undefined' &&

        // If queryCommandSupported returns true, assume it's correct since
        // we're ignoring Firefox for now.
        document.queryCommandSupported &&
        document.queryCommandSupported('copy') ||

        // If we get this far we have to take some more drastic measures to
        // work around a bug in Chrome where currently it only returns true for
        // the `queryCommandSupported('copy')` method if it's initiated by user
        // interaction. https://goo.gl/6bkQ7T
        /Chrome\/(\d+)/.test(navigator.userAgent) && (+RegExp.$1 >= 43)
      );
    }
  }())

};
