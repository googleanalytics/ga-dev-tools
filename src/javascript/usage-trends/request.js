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


/* global gapi */


export const makeRequest = (reportRequest) => {
  return new Promise((resolve, reject) => {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [reportRequest],
      },
    }).then(
        ({result}) => resolve(result.reports[0]),
        ({result}) => reject(result.error));
  });
};

export const makeFullRequest = (reportRequest, lastReport) => {
  return makeRequest(reportRequest).then((report) => {
    if (lastReport) {
      report.data.rows = report.data.rows.concat(lastReport.data.rows);
    }
    if (report.nextPageToken) {
      reportRequest.pageToken = report.nextPageToken;
      return makeFullRequest(reportRequest, report);
    } else {
      return report;
    }
  });
};
