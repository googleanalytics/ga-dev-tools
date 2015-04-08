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


var ParamElement = React.createClass({
  getInitialState: function() {
    return {name: this.props.param.name, value: this.props.param.value};
  },
  componentWillReceiveProps: function(props) {
    //console.log('<ParamElement> componentWillReceiveProps');
    //this.setState({hitUrl: props.hitUrl});
  },
  handleNameChange: function(event) {
    var data = {name: event.target.value, value: this.state.value};
    this.setState(data)
    this.props.onParamChange(this.props.param.pid, data);
  },
  handleValueChange: function(event) {
    var data = {name: this.state.name, value: event.target.value};
    this.setState(data)
    this.props.onParamChange(this.props.param.pid, data);
  },
  remove: function() {
    this.props.onParamRemove(this.props.param.pid);
  },
  render: function() {
    return (
      <div className="ParamElement">
        <input value={this.state.name}
               onChange={this.handleNameChange} />
        <input value={this.state.value}
               onChange={this.handleValueChange} />
        <button onClick={this.remove}>remove</button>
      </div>
    );
  }
});


module.exports = ParamElement;
