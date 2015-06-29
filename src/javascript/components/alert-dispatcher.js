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


import Alert from './alert';
import Collection from '../collection';
import Model from '../model';
import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';


let alerts = new Collection();


export default class AlertDispatcher extends React.Component {

  static add(props) {
    alerts.add(new Model(props));
  }

  /**
   * Only add the alert if an identical alert is not already present.
   */
  static addOnce(props) {
    if (!alerts.find(props)) {
      AlertDispatcher.add(props);
    }
  }

  handleRemove(model) {
    alerts.remove(model)
  }

  componentDidMount() {
    let update = () => this.forceUpdate();
    alerts.on('add', update);
    alerts.on('remove', update);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        component="div"
        className="AlertDispatcher"
        transitionName="Alert">
        {alerts.models.map((model) => (
          <Alert
            {...model.get()}
            key={model.uid}
            onRemove={this.handleRemove.bind(this, model)} />
        ))}
      </ReactCSSTransitionGroup>
    );
  }
}


// Only add AlertDispatcher to the DOM if this module gets imported.
let alertDispatcherContainer = document.createElement('div');
document.body.appendChild(alertDispatcherContainer);
React.render(<AlertDispatcher />, alertDispatcherContainer);
