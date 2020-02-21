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

import React from "react";
import uuid from "uuid";
import HitElement from "./hit-element";
import ParamButtonElement from "./param-button-element";
import ParamElement from "./param-element";
import ParamSearchSuggestElement from "./param-search-suggest-element";
import ParamSelectElement from "./param-select-element";
import IconButton from "../../components/icon-button";
import actions from "../actions";
import { State } from "../types";
import { useDispatch, useSelector } from "react-redux";

const HIT_TYPES = [
  "pageview",
  "screenview",
  "event",
  "transaction",
  "item",
  "social",
  "exception",
  "timing"
];

const HitBuilder: React.FC = () => {
  const { validationMessages, params, properties } = useSelector<State, State>(
    a => a
  );
  const dispatch = useDispatch();
  const [newParamNeedsFocus, setNewParamNeedsFocus] = React.useState(false);

  // Not sure If we need this.
  React.useEffect(() => {
    setNewParamNeedsFocus(false);
  }, []);

  const getValidationMessageForParam = React.useCallback(
    (paramName: string) => {
      const message = validationMessages.find(m => m.param === paramName);
      return message && message.description;
    },
    [validationMessages]
  );

  const handleGenerateUuid = React.useCallback(() => {
    dispatch(actions.editParamValue(params[3].id, uuid.v4()));
  }, [params, dispatch]);

  const handleAddParam = React.useCallback(() => {
    setNewParamNeedsFocus(true);
    dispatch(actions.addParam);
  }, [dispatch]);

  const [v, t, tid, cid, ...otherParams] = params;
  return (
    <div>
      <div className="HeadingGroup HeadingGroup--h3">
        <h3>Hit summary</h3>
        <p>
          The box below displays the full hit and its validation status. You can
          update the hit in the text box and the parameter details below will be
          automatically updated.
        </p>
      </div>

      <HitElement />

      <div className="HitBuilderParams">
        <div className="HeadingGroup HeadingGroup--h3">
          <h3>Hit parameter details</h3>
          <p>
            The fields below are a breakdown of the individual parameters and
            values for the hit in the text box above. When you update these
            values, the hit above will be automatically updated.
          </p>
        </div>

        <ParamSelectElement
          dispatch={dispatch}
          param={v}
          options={["1"]}
          message={getValidationMessageForParam(v.name)}
        />

        <ParamSelectElement
          dispatch={dispatch}
          param={t}
          options={HIT_TYPES}
          message={getValidationMessageForParam(t.name)}
        />

        <ParamSearchSuggestElement
          dispatch={dispatch}
          param={tid}
          options={properties}
          placeholder="UA-XXXXX-Y"
          message={getValidationMessageForParam(tid.name)}
        />

        <ParamButtonElement
          dispatch={dispatch}
          param={cid}
          type="refresh"
          title="Randomly generate UUID"
          message={getValidationMessageForParam(cid.name)}
          onClick={handleGenerateUuid}
        />

        {otherParams.map(param => {
          const isLast = param === otherParams[otherParams.length - 1];
          return (
            <ParamElement
              dispatch={dispatch}
              key={param.id}
              param={param}
              needsFocus={isLast && newParamNeedsFocus}
              message={getValidationMessageForParam(param.name)}
              onRemove={() => {
                dispatch(actions.removeParam(param.id));
              }}
            />
          );
        })}

        <div className="HitBuilderParam HitBuilderParam--action">
          <div className="HitBuilderParam-body">
            <IconButton
              type="add-circle"
              iconStyle={{ color: "hsl(150,60%,40%)" }}
              onClick={handleAddParam}
            >
              Add parameter
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HitBuilder;
