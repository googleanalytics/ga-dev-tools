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

import {composeRequest, syntaxHighlight} from '../request';
import React from 'react';


export default class RequestViewer extends React.Component {

  /** @return {Object} */
  render() {
    let {params, settings} = this.props;

    let formatted = syntaxHighlight(composeRequest(params, settings));

    return (
      <div>
        <h3> JSON request</h3>
        <pre
          cols="80"
          rows="20"
          id="query-output"
          dangerouslySetInnerHTML={{__html: formatted}}>
        </pre>
      </div>
    );
  }
}
