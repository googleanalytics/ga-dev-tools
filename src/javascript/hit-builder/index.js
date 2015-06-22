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


import HitValidator from './elements/hit-validator';
import React from 'react';


// TODO
// --------------------------------------------------------------------------
// [x] Add preset choices for v and t params.
// [x] Handle cases where a v and t values are not one of the preset choices.
// [x] Remove the URLs from the error messages.
// [x] Add links to the param docs.
// [x] Add visual error state to the params when they're invalid.
// [x] Add an icon indicating whether or not the hit is valid.
// [x] Add a button to send a valid hit.
// [x] Add a button to copy the hit body to the clipboard.
// [x] Add a button to copy a shareable hit URL.
// [ ] Lookup `tid` param.
// [ ] Auto-generate a UUID for the `cid` param.
// [ ] Handle validation request timeouts/errors.


React.render(
  <HitValidator />,
  document.getElementById('react-test')
);
