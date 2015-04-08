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


/* global $ */


import ParamModel from './param-model';

// var ParamElementCollection = require('./param-element-collection');

var HitElement = require('./hit-element');
var ParamElement = require('./param-element');
var React = require('react');
var url = require('url');


module.exports = {
  init: function() {

    const HIT = 'v=1&_v=j33&a=2125927068&t=pageview&_s=1&dl=https%3A%2F%2Fdevelopers.google.com%2Fanalytics%2Fdevguides%2Freporting%2Fcore%2Fdimsmets&ul=en-us&de=UTF-8&dt=Dimensions%20%26%20Metrics%20Reference%20-%20Google%20Analytics%20%E2%80%94%20Google%20Developers&sd=24-bit&sr=1440x900&vp=602x778&je=1&fl=16.0%20r0&_utma=171161141.1863589362.1423249192.1424887816.1424887816.5&_utmz=171161141.1424887816.4.2.utmcsr%3Dcode.google.com%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2Fapis%2Fexplorer%2F&_utmht=1424992426499&_u=QBECAAQBI~&jid=921458479&cid=1863589362.1423249192&tid=UA-41425441-2&_r=1&z=1390611190';

    var model = new ParamModel();
    var foo = 1000;

    function render() {
      React.render(
        <div>
          <HitElement hitUrl={model.toQueryString()}
                      onHitUrlChange={model.parse.bind(model)} />
          <div>
            {model.params.map(param => {
              return (
                <ParamElement
                  onParamChange={model.update.bind(model)}
                  onParamRemove={model.remove.bind(model)}
                  param={param}
                  key={param.pid} />
              );
            })}
          </div>
          <button onClick={model.add.bind(model)}>+ Add new</button>
        </div>,
        document.getElementById('react-test')
      );
    }

    model.on('change', render);
    model.parse(HIT);
  }
};
