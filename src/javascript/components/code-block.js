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
import {highlight} from '../highlighter';


/**
 * A component that renders highlighted code blocks.
 */
export default class CodeBlock extends React.Component {

  static defaultProps = {
    code: '',
    lang: null,
  }

  /**
   * React lifecycyle methods below:
   * http://facebook.github.io/react/docs/component-specs.html
   * ---------------------------------------------------------
   */


  /**
   * Handles rehighlighting the syntax.
   * @param {Object} nextProps
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return !(this.props.code === nextProps.code &&
        this.props.lang === nextProps.lang);
  }


  /** @return {Object} The React component. */
  render() {
    let code = highlight(this.props);
    return (
      <pre className="hljs" dangerouslySetInnerHTML={{__html: code}} />
    );
  }
}
