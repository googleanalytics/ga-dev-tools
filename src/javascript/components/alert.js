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


import Icon from './icon';
import React from 'react';


let zIndex = 0;


export default class Alert extends React.Component {

  render() {
    return (
      <div
        className="Alert"
        style={{zIndex: zIndex--}}>
        <div className="Alert-icon">
          <Icon type="error-outline" />
        </div>
        <div className="Alert-body">
          <h1 className="Alert-title">{this.props.title}</h1>
          <div className="Alert-message">{this.props.message}</div>
        </div>
        <button
          className="Alert-close"
          onClick={this.props.onRemove}>
          <Icon type="close" />
        </button>
      </div>
    );
  }
}
