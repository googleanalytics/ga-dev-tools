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

import {composeRequest} from '../request';
import React from 'react';
import CodeBlock from '../../components/code-block';


/**
 * A components that renders the request JSON.
 */
export default class RequestViewer extends React.Component {

  /** @return {Object} The React component. */
  render() {
    let {params, settings} = this.props;
    let request = composeRequest(params, settings);
    let requestJson = JSON.stringify(request, null, 2);

    return (
      <CodeBlock code={requestJson} lang="json" />
    );
  }
}
