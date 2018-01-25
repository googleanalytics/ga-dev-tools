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


import {gaAll, NULL_VALUE} from '../analytics';


const dimensions = {
  METRIC: 'dimension16',
  DIMENSION: 'dimension17',
  DATE_RANGE: 'dimension18',
  MAX_RESULTS: 'dimension19',
};


export const setParams = (paramValues) => {
  gaAll('set', {
    [dimensions.METRIC]: paramValues.metric,
    [dimensions.DIMENSION]: paramValues.dimension,
    [dimensions.DATE_RANGE]: String(paramValues.dateRange),
    [dimensions.MAX_RESULTS]: String(paramValues.maxResults),
  });
};

export const trackParamChange = (fieldName) => {
  gaAll('send', 'event', 'Trend Report', 'update', fieldName);
};


export const trackPresetSelect = (presetName) => {
  gaAll('send', 'event', 'Trend Report', 'preset', presetName);
};


export const trackReportCreate = () => {
  gaAll('send', 'event', 'Trend Report', 'create', NULL_VALUE);
};


export const trackReportError = (err) => {
  gaAll('send', 'event', 'Trend Report', 'error', {
    eventLabel: `(${err.code}: ${err.status}) ${err.message}`,
  });
};
