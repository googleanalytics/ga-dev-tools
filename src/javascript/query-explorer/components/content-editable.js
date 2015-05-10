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


import React from 'react';
import Selectable from 'selectable';


export default class ContentEditable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {html: this.props.html};
    this.handleContentEdit = this.handleContentEdit.bind(this);
  }

  componentDidMount() {
    this.selection = new Selectable(React.findDOMNode(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.html != this.state.html) {
      this.setState({html: nextProps.html});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.html != this.state.html;
  }

  componentWillUpdate() {
    if (!this.selectionAfterUpdate) {
      this.selectionAfterUpdate = this.selection.get();
    }
  }

  componentDidUpdate() {
    if (this.selectionAfterUpdate) {
      let {startIndex, endIndex} = this.selectionAfterUpdate;
      this.selection.set(startIndex, endIndex);
      this.selectionAfterUpdate = null;
    }
  }

  handleContentEdit(e){
    let html = e.target.innerHTML;
    let value = e.target.textContent;
    let name = this.props.name;
    this.setState({html});
    this.props.onChange.call(this, {target: {value, name, html}});
  }

  render() {
    return <div
      {...this.props}
      onInput={this.handleContentEdit}
      contentEditable="true"
      dangerouslySetInnerHTML={{__html: this.props.html}}>
    </div>;
  }
}
