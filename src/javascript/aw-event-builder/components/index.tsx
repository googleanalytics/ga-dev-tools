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
import EditUserProperties from "./EditUserProperties";
import ReduxManagedInput from "./ReduxManagedInput";
import { ReduxManagedCheckbox } from "./ReduxManagedInput";
import APISecret from "./APISecret";
import actions from "../actions";
import { State, MPEvent, MPEventType } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { MPEventCategory } from "../types/events";
import Icon from "../../components/icon";

const HitBuilder: React.FC = () => {
  // TODO - The event picker should probably let you do a search to filter the dropdown.
  // TODO - make sure to focus on any new params.
  const {
    event,
    client_id,
    user_id,
    measurement_id,
    firebase_app_id,
    app_instance_id,
    timestamp_micros,
    non_personalized_ads,
  } = useSelector<State, State>((a) => a);
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState<MPEventCategory>(
    event.getCategories()[0]
  );

  const updateEvent = React.useCallback(
    (event: MPEvent) => {
      dispatch(actions.setEvent(event));
    },
    [dispatch]
  );

  React.useEffect(() => {
    // If the new category doesn't have the current eventType as an option,
    // update it to an empty one.
    const categoryHasEvent =
      event.getCategories().find((c) => c === category) !== undefined;
    if (!categoryHasEvent) {
      const firstEventFromNewCategory = MPEvent.eventTypes(category)[0];
      updateEvent(MPEvent.empty(firstEventFromNewCategory));
    }
  }, [category, event]);

  const updateClientId = React.useCallback(
    (clientId: string) => {
      dispatch(actions.setClientId(clientId));
    },
    [dispatch]
  );
  const updateAppInstanceId = React.useCallback(
    (appInstanceId: string) => {
      dispatch(actions.setAppInstanceId(appInstanceId));
    },
    [dispatch]
  );
  const updateUserId = React.useCallback(
    (userId: string) => {
      dispatch(actions.setUserId(userId));
    },
    [dispatch]
  );
  const updateMeasurementId = React.useCallback(
    (measurement_id: string) => {
      dispatch(actions.setMeasurementId(measurement_id));
    },
    [dispatch]
  );
  const updateFirebaseAppId = React.useCallback(
    (firebase_app_id: string) => {
      dispatch(actions.setFirebaseAppId(firebase_app_id));
    },
    [dispatch]
  );
  const updateTimestampMicros = React.useCallback(
    (timestampMicros: string) => {
      try {
        const asNumber = parseInt(timestampMicros, 10);
        if (isNaN(asNumber)) {
          dispatch(actions.setTimestampMicros(null));
          return;
        }
        dispatch(actions.setTimestampMicros(asNumber));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch]
  );
  const updateNonPersonalizedAds = React.useCallback(
    (nonPersonalizedAds: boolean) => {
      dispatch(actions.setNonPersonalizedAds(nonPersonalizedAds));
    },
    [dispatch]
  );

  const updateCustomEventName = React.useCallback(
    (name) => {
      updateEvent(event.updateName(name));
    },
    [event, updateEvent]
  );

  const eventReferenceUrl = `https://developers.google.com/analytics/devguides/collection/protocol/app-web/reference/events?tech=aw_measurement_protocol#${event.getEventName()}`;

  return (
    <div>
      <div className="HeadingGroup HeadingGroup--h3">
        <h3>Hit summary</h3>
        <p>The box below displays the full event and its validation status.</p>
      </div>

      <ValidateEvent />

      <div className="HitBuilderParams">
        <div className="HeadingGroup HeadingGroup--h3">
          <APISecret />
          <div className="HitBuilderParam">
            <ReduxManagedInput
              disabled={measurement_id !== "" || client_id !== ""}
              labelText="firebase_app_id"
              update={updateFirebaseAppId}
              initialValue={firebase_app_id}
            />
            <ReduxManagedInput
              disabled={firebase_app_id !== "" || app_instance_id !== ""}
              labelText="measurement_id"
              update={updateMeasurementId}
              initialValue={measurement_id}
            />
          </div>
          <div className="HitBuilderParam">
            <ReduxManagedInput
              disabled={measurement_id !== "" || client_id !== ""}
              labelText="app_instance_id"
              update={updateAppInstanceId}
              initialValue={app_instance_id}
            />
            <ReduxManagedInput
              disabled={firebase_app_id !== "" || app_instance_id !== ""}
              labelText="client_id"
              update={updateClientId}
              initialValue={client_id}
            />
          </div>
          <ReduxManagedInput
            labelText="user_id"
            update={updateUserId}
            initialValue={user_id}
          />
          <div className="HitBuilderParam">
            <ReduxManagedCheckbox
              labelText="non_personalized_ads"
              update={updateNonPersonalizedAds}
              value={non_personalized_ads}
            />
            <ReduxManagedInput
              labelText="timestamp_micros"
              update={updateTimestampMicros}
              initialValue={timestamp_micros?.toString()}
            />
          </div>
          <div className="HitBuilderParam">
            <div className="HitBuilderParam">
              <label className="HitBuilderParam-label">Category</label>
              <select
                className="FormField"
                value={category}
                onChange={(e) => {
                  const newCategory: MPEventCategory = e.target
                    .value as MPEventCategory;
                  setCategory(newCategory);
                }}
              >
                {MPEvent.categories().map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {category !== MPEventCategory.Custom && (
              <div className="HitBuilderParam">
                <label className="HitBuilderParam-label">Name</label>
                <select
                  className="FormField"
                  value={event.getEventType()}
                  onChange={(e) => {
                    const newEventType: MPEventType = e.target
                      .value as MPEventType;
                    const newEvent = MPEvent.empty(newEventType);
                    dispatch(actions.setEvent(newEvent));
                  }}
                >
                  {MPEvent.eventTypes(category).map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <a
                  href={eventReferenceUrl}
                  title={`Learn more about this event`}
                  className="HitBuilderParam-helpIcon-aw"
                >
                  <Icon type="info-outline" />
                </a>
              </div>
            )}
            {event.isCustomEvent() && (
              <ReduxManagedInput
                flex="0 0 4em"
                labelText="Name"
                update={updateCustomEventName}
                initialValue={event.getEventName()}
              />
            )}
          </div>
          <EditEvent event={event} updateEvent={updateEvent} />
          <EditUserProperties />
        </div>
      </div>
    </div>
  );
};

export default HitBuilder;
