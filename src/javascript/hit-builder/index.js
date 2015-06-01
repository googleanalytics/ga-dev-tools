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


import Collection from '../collection';
import HitElement from './hit-element';
import Model from '../model';
import ParamElement from './param-element';
import ParamsCollection from './params-collection';
import React from 'react';


let state = new Model();

// let params = new ParamsCollection();
let params = new ParamsCollection();


state.on('change', render);


function updateHit(hit = 'v=1&t=pageview&tid=UA-123456-1&cid=123') {
  if (params) params.destroy();

  params = new ParamsCollection(hit)
      .on('add', render)
      .on('remove', render)
      .on('change', render);


  // params.on('change', function(...args) {
  //   this.validate();
  // });

  render();
}


function handleCreateNew() {
  state.set('editing', true);
}


function render() {

  function getStarted() {
    return (
      <div>
        <button onClick={handleCreateNew}>Create new hit</button>
      </div>
    )
  }

  function paramList() {
    let newModel = new Model({name:'', value:''});
    return (
      <div>
        <div>
          <button onClick={params.validate}>Validate hit</button>
        </div>
        <HitElement
          hitUrl={params.toQueryString()}
          onBlur={updateHit} />
        {params.models.map((model) => {
          return (
            <ParamElement
              model={model}
              key={model.uid}
              onRemove={params.remove.bind(params, model)} />
          );
        })}
        <button
          onClick={params.add.bind(params, newModel)}>
          + Add new</button>
      </div>
    )
  }

  React.render(
    <div>
      {state.get('editing') ? paramList() : getStarted()}
    </div>,
    document.getElementById('react-test')
  );
}


updateHit();

