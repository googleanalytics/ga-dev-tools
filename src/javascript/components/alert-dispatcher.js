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
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


let alerts = new Collection();


export default class AlertDispatcher extends React.Component {

  /**
   * Adds an alert models to the collection.
   * @param {Object} props The alert props.
   */
  static add(props) {
    alerts.add(new Model(props));
  }


  /**
   * Only adds the alert if an identical alert is not already present.
   * @param {Object} props The alert props to check for before adding.
   */
  static addOnce(props) {
    if (!alerts.find(props)) {
      AlertDispatcher.add(props);
    }
  }


  /**
   * Removes an alert model from the collection.
   * @param {Model} model
   */
  handleRemove(model) {
    alerts.remove(model)
  }


  /**
   * React lifecycyle method below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

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
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
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
ReactDOM.render(<AlertDispatcher />, alertDispatcherContainer);
