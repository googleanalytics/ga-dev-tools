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


/* global gapi */


import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { syntaxHighlight } from '../request';
import HistogramChart from './histogram-chart';
import PivotTable from './pivot-table';
import AlertDispatcher from '../../components/alert-dispatcher';

const RESULTS_VIEW = {
  'HISTOGRAM': 'Chart',
  'PIVOT': 'Table',
  'COHORT': 'Table'
}

export default class ResultsViewer extends React.Component {
  render() {
    let {response, settings} = this.props;

    if (response.status > 200) {

      return (
          <div>
          <h2>API Response</h2>
          <pre dangerouslySetInnerHTML={{__html: syntaxHighlight(response.result, null, 2)}}>
          </pre>
          </div>
      );
    } else if (response.status == 200) {
      return(
          <div>
          <Tabs selectedIndex={0}>
            <TabList>
              <Tab>Response {RESULTS_VIEW[settings.responseType]}</Tab>
              <Tab>Response JSON</Tab>
            </TabList>
            <TabPanel>
              <h2>Response {RESULTS_VIEW[settings.responseType]}</h2>
              {settings.responseType == 'HISTOGRAM' ? (
                <HistogramChart
                  response={response}
                />
              ) :
              null}
              {settings.responseType == 'PIVOT' ? (
                <PivotTable
                  response={response}
                />
              ) :
              null}
            </TabPanel>
            <TabPanel>
              <h2>API Response</h2>
              <pre dangerouslySetInnerHTML={{__html: syntaxHighlight(response.result, null, 2)}}>
              </pre>
            </TabPanel>

          </Tabs>
          </div>
      );
    }
    return (null);
  }
}


