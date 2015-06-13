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
import Icon from './icon';
import React from 'react';


export default class IconButton extends React.Component {
  render() {
    let nodeType = this.props.href ? 'a' : 'button';
    return React.createElement(nodeType, this.props,
        <span className="Button-icon"><Icon type={this.props.type} /></span>,
        this.props.children);
  }
}

IconButton.defaultProps = {className: 'Button Button--withIcon'};
