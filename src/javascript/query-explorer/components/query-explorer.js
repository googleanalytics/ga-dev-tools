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


import MultiSearchSuggest from './components/multi-search-suggest';
import QueryForm from './components/query-form';
import QueryReport from './components/query-report';
import React from 'react';
import SearchSuggest from './components/search-suggest';
import SortMultiSearchSuggest from './components/sort-multi-search-suggest';
import ViewSelector from './components/view-selector';


export default class QueryExplorer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const REFERENCE_URL = 'https://developers.google.com' +
                          '/analytics/devguides/reporting/core/v3/reference#';

    let iconInfo =
        `<svg class="Icon" viewBox="0 0 16 16">
           <use xlink:href="/public/images/icons.svg#icon-info"></use>
         </svg>`;

    return (
      <div>
        <h3 className="H3--underline">Select a view</h3>

        <ViewSelector
          ids={params.get('ids')}
          onChange={handleViewSelectorChange} />

        <h3 className="H3--underline">Set the query parameters</h3>

        <form onSubmit={handleSubmit}>

          <div className="FormControl FormControl--inline FormControl--required">
            <label className="FormControl-label">metrics</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <MultiSearchSuggest
                  name="metrics"
                  value={params.get('metrics')}
                  options={metrics}
                  onChange={handleFieldChange} />
                <a
                  className="FlexLine-item FormControl-helpIcon"
                  href={REFERENCE_URL + 'metrics'}
                  tabIndex="-1"
                  dangerouslySetInnerHTML={{__html: iconInfo}}></a>
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">dimensions</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <MultiSearchSuggest
                  name="dimensions"
                  value={params.get('dimensions')}
                  options={dimensions}
                  onChange={handleFieldChange} />
                <a
                  className="FlexLine-item FormControl-helpIcon"
                  href={REFERENCE_URL + 'dimensions'}
                  tabIndex="-1"
                  dangerouslySetInnerHTML={{__html: iconInfo}}></a>
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline">
            <label className="FormControl-label">sort</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <SortMultiSearchSuggest
                  name="sort"
                  value={params.get('sort')}
                  options={sortOptions}
                  onChange={handleFieldChange} />
                <a
                  className="FlexLine-item FormControl-helpIcon"
                  href={REFERENCE_URL + 'dimensions'}
                  tabIndex="-1"
                  dangerouslySetInnerHTML={{__html: iconInfo}}></a>
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline FormControl--required">
            <label className="FormControl-label">segment</label>
            <div className="FormControl-body">
              <div className="FlexLine">
                <SearchSuggest
                  name="segment"
                  value={params.get('segment')}
                  options={segments}
                  onChange={handleFieldChange} />
                <a
                  className="FlexLine-item FormControl-helpIcon"
                  href={REFERENCE_URL + 'segment'}
                  tabIndex="-1"
                  dangerouslySetInnerHTML={{__html: iconInfo}}></a>
              </div>
            </div>
          </div>

          <div className="FormControl FormControl--inline FormControl--action">
            <div className="FormControl-body">
              <button
                className="Button Button--action"
                disabled={state.get('isQuerying')}>
                {state.get('isQuerying') ? 'Loading...' : 'Run Query'}
              </button>
            </div>
          </div>
        </form>

        <div style={{padding: '5em'}}></div>

        <QueryReport
          report={state.get('report')}
          isQuerying={state.get('isQuerying')}
          includeIds={settings.get('includeIds')}
          includeAccessToken={settings.get('includeAccessToken')}
          onSuccess={handleDataChartSuccess}
          onError={handleDataChartError}
          onIdsToggle={handleIdsToggle}
          onAccessTokenToggle={handleAccessTokenToggle}
          onDirectLinkFocus={handleDirectLinkFocus}
          onApiUriFocus={handleApiUriFocus}
          onDownloadTsvClick={handleDownloadTsvClick} />

      </div>
    );
  }
}
