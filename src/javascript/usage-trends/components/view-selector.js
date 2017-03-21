// Copyright 2017 Google Inc. All rights reserved.
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


import accountSummaries from 'javascript-api-utils/lib/account-summaries';
import React, {Component} from 'react';
import FormControl from './form-control';
import AlertDispatcher from '../../components/alert-dispatcher';

// Styles
import styles from './view-selector.css';
import formField from '../styles/form-field.css';


/**
 * A component to select one fo the user's Google Analytics views.
 */
export default class ViewSelector extends Component {
  state = {};

  /**
   * Accpets a view ID and updates the state tree with the corresponding
   * account, property, and view data.
   * @param {number} viewId
   */
  setSelectedView = (viewId) => {
    const {summaries} = this;
    const accounts = summaries.allAccounts();
    const account = summaries.getAccountByViewId(viewId);
    const properties = account.properties;
    const property = summaries.getPropertyByViewId(viewId);
    const views = property.views;
    const view = summaries.getView(viewId);

    this.setState({
      accounts,
      account,
      properties,
      property,
      views,
      view,
    });
  }

  /**
   * Handles responding to changes in the account <select>.
   * @param {{target: (Element)}} arg1
   */
  handleAccountChange = ({target}) => {
    const account = this.summaries.getAccount(target.value);
    this.setSelectedView(account.properties[0].views[0].id);
  }

  /**
   * Handles responding to changes in the account <select>.
   * @param {{target: (Element)}} arg1
   */
  handlePropertyChange = ({target}) => {
    const property = this.summaries.getProperty(target.value);
    this.setSelectedView(property.views[0].id);
  }

  /**
   * Handles responding to changes in the account <select>.
   * @param {{target: (Element)}} arg1
   */
  handleViewChange = ({target}) => {
    const view = this.summaries.getView(target.value);
    this.setSelectedView(view.id);
  }

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */

  /**
   * Handles querying the Management API for account data the first time the
   * component is added to the DOM.
   */
  componentDidMount() {
    // The component should not be mounted unless the user is signed in.
    accountSummaries.get({ignoreEmpty: true}).then((summaries) => {
      this.summaries = summaries;
      const accounts = summaries.allAccounts();

      if (!accounts.length) {
        import('../../analytics').then((analytics) => {
          analytics.trackNoGoogleAnalyticsAccounts();
        });
        AlertDispatcher.addOnce({
          title: `You don't have any Google Analytics accounts`,
          message: `To use this tool you need to have read-access to
                    at least one Google Analytics account.`,
        });
        return;
      }

      if (this.props.viewId) {
        this.setSelectedView(this.props.viewId);
      } else {
        this.setSelectedView(accounts[0].properties[0].views[0].id);
      }
    });
  }

  /**
   * Handles changes to the viewId prop in parent components.
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewId != this.props.viewId) {
      this.setSelectedView(nextProps.viewId);
    }
  }

  /**
   * Handles firing the `onChange` prop function any time the state changes.
   * @param {Object} nextProps
   * @param {Object} nextState
   */
  componentWillUpdate(nextProps, nextState) {
    const viewId = this.state.view && this.state.view.id;
    const nextViewId = nextState.view && nextState.view.id;

    if (nextViewId != viewId) {
      const {account, property, view} = nextState;
      this.props.onChange({account, property, view});
    }
  }

  /** @return {Object} The React component. */
  render() {
    if (this.state.hasNoViews) {
      return (
        <p>Oops, you don't appear to have any Google Analytics accounts, you
        can sign up for an account at <a href="https://google.com/analytics">
        google.com/analytics</a></p>
      );
    } else {
      const {accounts, account, properties, property, views, view} = this.state;

      return (
        <div className={styles.root}>
          <div className={styles.item}>
            <FormControl full label="Account">
              {accounts && <select
                className={formField.root}
                onChange={this.handleAccountChange}
                value={account.id}>
                {accounts.map((account, i) => (
                  <option key={i} value={account.id}>{account.name}</option>
                ))}
              </select>}
            </FormControl>
          </div>

          <div className={styles.item}>
            <FormControl full label="Property">
              {properties && <select
                className={formField.root}
                onChange={this.handlePropertyChange}
                value={property.id}>
                {properties.map((property, i) => (
                  <option key={i} value={property.id}>{property.name}</option>
                ))}
              </select>}
            </FormControl>
          </div>

          <div className={styles.item}>
            <FormControl full label="View">
              {views && <select
                className={formField.root}
                onChange={this.handleViewChange}
                value={view.id}>
                {views.map((view, i) => (
                  <option key={i} value={view.id}>{view.name}</option>
                ))}
              </select>}
            </FormControl>
          </div>
        </div>
      );
    }
  }
}
