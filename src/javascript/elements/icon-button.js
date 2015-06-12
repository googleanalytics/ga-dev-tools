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


import assign from 'lodash/object/assign';
import React from 'react';


const ICON_PATH = '/public/images/icons.svg#icon-';


export default class ButtonIcon extends React.Component {

  render() {

    let nodeType = this.props.href ? 'a' : 'button';
    let icon =
        `<svg class="Icon" viewBox="0 0 16 16">
           <use xlink:href="${ICON_PATH}${this.props.icon}"></use>
         </svg>`;

    return React.createElement(nodeType, this.props,
        <span
          className="Button-icon"
          dangerouslySetInnerHTML={{__html: icon}} />,
        this.props.children);
  }
}

ButtonIcon.defaultProps = {className: 'Button Button--withIcon'};
