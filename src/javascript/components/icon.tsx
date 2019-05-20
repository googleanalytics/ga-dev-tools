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


import React from 'react';

// There is a known issue in React where for some reason a `use` element
// is not compatible with the render cycle, because somehow the Shadow
// DOM can't reconcile it. We therefore use this `key={current++}` hack
// to force React to unmount and remount the SVG every time it is rendered.
//
// See https://stackoverflow.com/questions/50771280/react-svg-disappearing-when-component-rerenders
// and http://sfdcinpractice.com/index.php/2016/12/29/svg-icon-disappears-rerendering/
// for details

//let counter = 0

type IconType = "add-circle" |
    "arrow-back" |
    "arrow-forward" |
    "call-made" |
    "check" |
    "content-paste" |
    "close" |
    "error-outline" |
    "event" |
    "file-download" |
    "home" |
    "info-outline" |
    "link" |
    "menu" |
    "person" |
    "remove-circle" |
    "refresh" |
    "send" |
    "warning" |
    "bitly-logo";

/**
 * A components that renders an <svg> icon from the iconset in:
 * src/images/icons.svg
 */
const Icon: React.FC<{type: IconType}> = ({type}) => (
    <svg className="Icon" viewBox="0 0 24 24">
          <use key={0} href={`/public/images/icons.svg#icon-${type}`} />
    </svg>
);

/*

*/

export default Icon
