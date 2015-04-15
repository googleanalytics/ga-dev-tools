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


var HitElement = React.createClass({
  // getInitialState: function() {
  //   return {hitUrl: this.props.hitUrl};
  // },
  // componentWillReceiveProps: function(props) {
  //   this.setState({hitUrl: props.hitUrl});
  // },
  // handleChange: function(event) {
  //   this.setState({hitUrl: event.target.value});
  // },
  // handleBlur: function() {
  //   this.props.onBlur(this.state.hitUrl);
  // },
  render: function() {
    /*
    return (
      <textarea
        rows="6"
        cols="80"
        value={this.state.hitUrl}
        onChange={this.handleChange}
        onBlur={this.handleBlur} />
    );
    */
    return (<div>{this.props.hitUrl}</div>)
  }
});


module.exports = HitElement;
