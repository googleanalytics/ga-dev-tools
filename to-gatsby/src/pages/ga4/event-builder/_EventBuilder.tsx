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

import React from "react"
import useEvents from "./_useEvents"
import LinkedTextField from "../../../components/LinkedTextField"
import {
  Typography,
  TextField,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import { MPEventCategory, MPEventType, MPEvent } from "./_types/_index"
import Autocomplete from "@material-ui/lab/Autocomplete"
import EditEvent from "./_EditEvent"
import EditUserProperties from "./_EditUserProperties"
import ValidateEvent from "./_ValidateEvent"

const useStyles = makeStyles(theme => ({
  unifiedParameters: {
    "& > *": {
      marginTop: theme.spacing(1),
    },
  },
  parameterPair: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

const EventBuilder: React.FC = () => {
  const classes = useStyles()
  const {
    event,
    validateEvent,
    setEvent,
    category,
    api_secret,
    setAPISecret,
    firebase_app_id,
    setFirebaseAppId,
    measurement_id,
    setMeasurementId,
    client_id,
    setClientId,
    app_instance_id,
    setAppInstanceId,
    user_id,
    setUserId,
    updateCustomEventName,
    updateEventCategory,
    non_personalized_ads,
    setNonPersonalizedAds,
    timestamp_micros,
    setTimestampMicros,
    validationStatus,
    validationMessages,
    user_properties,
    setUserProperties,
    payload,
  } = useEvents()

  // const eventReferenceUrl = `https://developers.google.com/analytics/devguides/collection/protocol/app-web/reference/events?tech=aw_measurement_protocol#${event.getEventName()}`

  return (
    <div>
      <Typography variant="h3">Hit Summary</Typography>
      <Typography>
        The box below displays the full event and its validation status.
      </Typography>

      <ValidateEvent
        payload={payload}
        validateEvent={validateEvent}
        validationMessages={validationMessages}
        validationStatus={validationStatus}
        event={event}
        user_properties={user_properties}
        client_id={client_id}
        user_id={user_id}
        api_secret={api_secret}
        measurement_id={measurement_id}
        app_instance_id={app_instance_id}
        firebase_app_id={firebase_app_id}
      />

      <div className={classes.unifiedParameters}>
        <section className={classes.parameterPair}>
          <LinkedTextField
            href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#api_secret"
            linkTitle="See api_secret on devsite."
            value={api_secret}
            label="api_secret"
            helperText=""
            onChange={setAPISecret}
          />
        </section>
        <section className={classes.parameterPair}>
          <LinkedTextField
            href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=firebase#firebase_app_id"
            linkTitle="See firebase_app_id on devsite."
            disabled={measurement_id !== "" || client_id !== ""}
            value={firebase_app_id}
            label="firebase_app_id"
            helperText=""
            onChange={setFirebaseAppId}
          />
          <LinkedTextField
            href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#measurement_id"
            linkTitle="See measurement_id on devsite."
            disabled={firebase_app_id !== "" || app_instance_id !== ""}
            value={measurement_id}
            label="measurement_id"
            helperText=""
            onChange={setMeasurementId}
          />
        </section>
        <section className={classes.parameterPair}>
          <LinkedTextField
            href=""
            linkTitle="See app_instance_id on devsite."
            disabled={measurement_id !== "" || client_id !== ""}
            value={app_instance_id}
            label="app_instance_id"
            helperText=""
            onChange={setAppInstanceId}
          />
          <LinkedTextField
            href=""
            linkTitle="See client_id on devsite."
            disabled={firebase_app_id !== "" || app_instance_id !== ""}
            value={client_id}
            label="client_id"
            helperText=""
            onChange={setClientId}
          />
        </section>
        <LinkedTextField
          href=""
          linkTitle="See user_id on devsite."
          value={user_id}
          label="user_id"
          helperText=""
          onChange={setUserId}
        />
        <section className={classes.parameterPair}>
          <Autocomplete<MPEventCategory, false, true, true>
            fullWidth
            disableClearable
            autoComplete
            autoHighlight
            autoSelect
            options={Object.values(MPEventCategory)}
            getOptionLabel={category => category}
            value={category}
            onChange={(_event, value) => {
              updateEventCategory(value as MPEventCategory)
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Category"
                size="small"
                variant="outlined"
              />
            )}
          />
          {!event.isCustomEvent() && (
            <Autocomplete<MPEventType, false, true, true>
              fullWidth
              disableClearable
              autoComplete
              autoHighlight
              autoSelect
              options={MPEvent.eventTypes(category)}
              getOptionLabel={eventType => eventType}
              value={event.getEventType()}
              onChange={(_event, value) => {
                setEvent(MPEvent.empty(value as MPEventType))
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Name"
                  size="small"
                  variant="outlined"
                />
              )}
            />
          )}
          {event.isCustomEvent() && (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Name"
              value={event.getEventName()}
              onChange={e => {
                updateCustomEventName(e.target.value)
              }}
            />
          )}
        </section>

        <section className={classes.parameterPair}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="timestamp_micros"
            value={timestamp_micros}
            onChange={e => {
              setTimestampMicros(e.target.value)
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={non_personalized_ads}
                onChange={e => {
                  setNonPersonalizedAds(e.target.checked)
                }}
              />
            }
            label="non_personalized_ads"
          />
        </section>
      </div>
      <EditEvent event={event} setEvent={setEvent} />
      <EditUserProperties
        user_properties={user_properties}
        setUserProperties={setUserProperties}
      />
    </div>
  )
}

export default EventBuilder
