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

  copyToClipboard: (function() {

    let isCopySupported;

    // TODO(philipwalton): At the moment, Firefox has a false positive on the
    // `queryCommandSupported('copy')` method, so at the moment we simply have
    // to exclude it. Once Firefox enables true support, remove this
    // conditional.
    // http://goo.gl/x4jcS
    if (typeof InstallTrigger === 'undefined') {

      // TODO(philipwalton): Chrome currently only returns true for the
      // `queryCommandSupported('copy')` method if it's initiated by user
      // interaction, so we have to listen for events and track it.
      // https://goo.gl/6bkQ7T
      $(document).on('click keydown touchstart', function fn(e) {
        try {
          isCopySupported = document.queryCommandSupported('copy');
        } catch(e) {
          isCopySupported = false;
        }
        $(document).off('click keydown touchstart', fn);
      });
    }

    return function() {
      return isCopySupported;
    }
  }())

};
