// Copyright 2020 Google Inc. All rights reserved.
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

import makeStyles from "@material-ui/core/styles/makeStyles"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Refresh from "@material-ui/icons/Refresh"

import LinkedTextField from "@/components/LinkedTextField"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import EditEvent from "./EditEvent"
import EditUserProperties from "./EditUserProperties"
import ValidateEvent from "./ValidateEvent"
import { MPEventCategory, MPEventType, MPEvent } from "./types"
import useEvents from "./useEvents"
import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
import ExternalLink from "@/components/ExternalLink"
import { Url } from "@/constants"
import WithHelpText from "@/components/WithHelpText"
import useFormStyles from "@/hooks/useFormStyles"

const ga4MeasurementProtocol = (
  <ExternalLink href={Url.ga4MeasurementProtocol}>
    GA4 Measurement Protocol
  </ExternalLink>
)

const useStyles = makeStyles(theme => ({
  unifiedParameters: {},
  fullWidth: {
    width: "100%",
  },
  parameterPair: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  validateHeading: {
    marginTop: theme.spacing(3),
  },
}))

export const ShowAdvancedCtx = React.createContext(false)

const EventBuilder: React.FC = () => {
  const formClasses = useFormStyles()
  const classes = useStyles()
  const [useFirebase, setUseFirebase] = React.useState(true)
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const {
    event,
    validateEvent,
    sendEvent,
    setEvent,
    parameterizedUrl,
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
  } = useEvents(useFirebase)

  return (
    <div>
      <Typography variant="h3">Overview</Typography>
      <Typography>
        The GA4 Event Builder allows you to create, validate, and send events
        using the {ga4MeasurementProtocol}.
      </Typography>
      <Typography variant="h4">Usage</Typography>
      <Typography>
        First, choose the client you are using with the toggle below. Mobile
        implementations should use firebase, and web implementations should use
        gtag.js
      </Typography>
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>gtag.js</Grid>
        <Grid item>
          <Switch
            checked={useFirebase}
            onChange={e => {
              setUseFirebase(e.target.checked)
            }}
            name="use firebase"
            color="primary"
          />
        </Grid>
        <Grid item>firebase</Grid>
      </Grid>

      <Typography>
        After choosing a client, fill out the inputs below.
      </Typography>

      <section className={formClasses.form}>
        <LinkedTextField
          required
          href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#api_secret"
          linkTitle="See api_secret on devsite."
          value={api_secret || ""}
          label="api_secret"
          helperText="The API secret for the property to send the event to."
          onChange={setAPISecret}
        />
        {useFirebase ? (
          <>
            <LinkedTextField
              required
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=firebase#firebase_app_id"
              linkTitle="See firebase_app_id on devsite."
              value={firebase_app_id || ""}
              label="firebase_app_id"
              helperText="The identifier for your firebase app."
              onChange={setFirebaseAppId}
            />
            <LinkedTextField
              required
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=firebase#app_instance_id"
              linkTitle="See app_instance_id on devsite."
              value={app_instance_id || ""}
              label="app_instance_id"
              helperText="The unique identifier for a specific Firebase installation."
              onChange={setAppInstanceId}
            />
          </>
        ) : (
          <>
            <LinkedTextField
              required
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#measurement_id"
              linkTitle="See measurement_id on devsite."
              value={measurement_id || ""}
              label="measurement_id"
              helperText="The identifier for your data stream."
              onChange={setMeasurementId}
            />
            <LinkedTextField
              required
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#client_id"
              linkTitle="See client_id on devsite."
              value={client_id || ""}
              label="client_id"
              helperText="The unique identifier for an instance of a web client."
              onChange={setClientId}
            />
          </>
        )}
        <LinkedTextField
          href={`https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=${
            useFirebase ? "firebase" : "gtag"
          }#user_id`}
          linkTitle="See user_id on devsite."
          value={user_id || ""}
          label="user_id"
          helperText="The unique identifier for a given user."
          onChange={setUserId}
        />

        <WithHelpText
          helpText="The category for the event."
          className={classes.fullWidth}
        >
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
                label="event category"
                size="small"
                variant="outlined"
              />
            )}
          />
        </WithHelpText>
        {!event.isCustomEvent() && (
          <WithHelpText
            className={classes.fullWidth}
            helpText="The name of the event"
          >
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
                  label="event name"
                  size="small"
                  variant="outlined"
                />
              )}
            />
          </WithHelpText>
        )}
        {event.isCustomEvent() && (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="event name"
            value={event.getEventName()}
            helperText="The name of the event"
            onChange={e => {
              updateCustomEventName(e.target.value)
            }}
          />
        )}
        <LinkedTextField
          label="timestamp_micros"
          linkTitle="See timestamp_micros on devsite."
          href={`https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=${
            useFirebase ? "firebase" : "gtag"
          }#timestamp_micros`}
          value={timestamp_micros}
          onChange={setTimestampMicros}
          helperText="The timestamp of the event."
          extraAction={
            <Tooltip title="Set to now.">
              <IconButton
                size="small"
                onClick={() => {
                  setTimestampMicros((new Date().getTime() * 1000).toString())
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          }
        />

        <WithHelpText
          helpText={
            <>
              Check to indicate events should not be used for personalized ads.
              See{" "}
              <ExternalLink
                href={`https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=${
                  useFirebase ? "firebase" : "gtag"
                }#non_personalized_ads`}
              >
                non_personalized_ads
              </ExternalLink>{" "}
              on devsite.
            </>
          }
        >
          <LabeledCheckbox
            checked={non_personalized_ads}
            setChecked={setNonPersonalizedAds}
          >
            non_personalized_ads
          </LabeledCheckbox>
        </WithHelpText>
      </section>

      <ShowAdvancedCtx.Provider value={showAdvanced}>
        <EditEvent
          event={event}
          setEvent={setEvent}
          setShowAdvanced={setShowAdvanced}
        />
      </ShowAdvancedCtx.Provider>

      {showAdvanced && (
        <EditUserProperties
          user_properties={user_properties}
          setUserProperties={setUserProperties}
        />
      )}

      <Typography variant="h3" className={classes.validateHeading}>
        Validate & Send
      </Typography>
      <ValidateEvent
        payload={payload}
        validationMessages={validationMessages}
        validationStatus={validationStatus}
        event={event}
        sendEvent={sendEvent}
        parameterizedUrl={parameterizedUrl}
        validateEvent={validateEvent}
        user_properties={user_properties}
        client_id={client_id || ""}
        user_id={user_id || ""}
        api_secret={api_secret || ""}
        measurement_id={measurement_id || ""}
        app_instance_id={app_instance_id || ""}
        firebase_app_id={firebase_app_id || ""}
      />
    </div>
  )
}

export default EventBuilder
