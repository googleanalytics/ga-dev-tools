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


import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Alert from './alert';


let id = 0;
let alerts = [];


/**
 * A singleton component that manages displaying alerts at the top of the page.
 */
export default class AlertDispatcher extends React.Component {

  /**
   * Adds an alert to the list of alerts.
   * @param {Object} alert An object of alert properties.
   */
  static add({title, message}) {
    alerts.push({title, message, id: id++});
    render();
  }


  /**
   * Only adds the alert if an identical alert is not already present.
   * @param {Object} props The alert props to check for before adding.
   */
  static addOnce({title, message}) {
    let existingAlert = alerts.find((a) =>
        a.title === title && a.message === message);

    if (!existingAlert) {
      AlertDispatcher.add({title, message});
    }
  }


  /**
   * Removes any alerts that may be shown.
   */
  static removeAll() {
    if (alerts.length) {
      alerts = [];
      render();
    }
  }


  /**
   * Removes an alert from the alert list.
   * @param {number} id The ID of the alert to remove.
   */
  handleRemove(id) {
    alerts = alerts.filter((alert) => id != alert.id);
    render();
  }


  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /** @return {Object} The React component. */
  render() {
    return (
      <ReactCSSTransitionGroup
        component="div"
        className="AlertDispatcher"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
        transitionName="Alert">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            title={alert.title}
            message={alert.message}
            onRemove={this.handleRemove.bind(this, alert.id)} />
        ))}
      </ReactCSSTransitionGroup>
    );
  }
}


// Only add AlertDispatcher to the DOM if this module gets imported.
let alertDispatcherContainer = document.createElement('div');
document.body.appendChild(alertDispatcherContainer);


/**
 * Renders the AlertDispatcher component to the page.
 */
function render() {
  ReactDOM.render(
    <AlertDispatcher alerts={alerts} />,
    alertDispatcherContainer
  );
}
render();
