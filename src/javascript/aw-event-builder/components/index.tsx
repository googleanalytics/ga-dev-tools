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
import ValidateEvent from "./ValidateEvent";
import EditEvent from "./EditEvent";
import ReduxManagedInput from "./ReduxManagedInput";
import AuthKey from "./APISecret";
import actions from "../actions";
import { State, MPEvent, MPEventType, ValidationStatus } from "../types";
import { useDispatch, useSelector } from "react-redux";

const HitBuilder: React.FC = () => {
  // TODO - The event picker should probably let you do a search to filter the dropdown.
  // TODO - make sure to focus on any new params.
  const { event } = useSelector<State, State>(a => a);
  const dispatch = useDispatch();

  const updateEvent = React.useCallback(
    (event: MPEvent) => {
      dispatch(actions.setEvent(event));
    },
    [dispatch]
  );

  const updateClientId = React.useCallback(
    (clientId: string) => {
      dispatch(actions.setClientId(clientId));
    },
    [dispatch]
  );
  const updateUserId = React.useCallback(
    (userId: string) => {
      dispatch(actions.setUserId(userId));
    },
    [dispatch]
  );
  const updateMid = React.useCallback(
    (mid: string) => {
      dispatch(actions.setMid(mid));
    },
    [dispatch]
  );

  const updateCustomEventName = React.useCallback(
    name => {
      updateEvent(event.updateName(name));
    },
    [event, updateEvent]
  );

  return (
    <div>
      <div className="HeadingGroup HeadingGroup--h3">
        <h3>Hit summary</h3>
        <p>The box below displays the full event and its validation status.</p>
      </div>

      <ValidateEvent />

      <div className="HitBuilderParams">
        <div className="HeadingGroup HeadingGroup--h3">
          <AuthKey />
          <ReduxManagedInput
            labelText="mid"
            update={updateMid}
            urlParamName="mid"
          />
          <ReduxManagedInput
            labelText="client_id"
            update={updateClientId}
            urlParamName="client_id"
          />
          <ReduxManagedInput
            labelText="user_id"
            update={updateUserId}
            urlParamName="user_id"
          />
          <div className="HitBuilderParam">
            <label className="HitBuilderParam-label">Event Type</label>
            <select
              className="FormField"
              value={event.getEventType()}
              onChange={e => {
                const newEventType: MPEventType = e.target.value as MPEventType;
                const newEvent = MPEvent.empty(newEventType);
                dispatch(actions.setEvent(newEvent));
              }}
            >
              {MPEvent.options().map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
            {event.getEventType() === MPEventType.CustomEvent && (
              <ReduxManagedInput
                flex="0 0 4em"
                labelText="Name"
                update={updateCustomEventName}
                urlParamName="custom_event_name"
              />
            )}
          </div>
          <EditEvent event={event} updateEvent={updateEvent} />
        </div>
      </div>
    </div>
  );
};

export default HitBuilder;
