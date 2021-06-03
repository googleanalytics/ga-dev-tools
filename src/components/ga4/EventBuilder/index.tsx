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
import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
import ExternalLink from "@/components/ExternalLink"
import { Url } from "@/constants"
import WithHelpText from "@/components/WithHelpText"
import useFormStyles from "@/hooks/useFormStyles"
import useEvent from "./useEvent"
import Parameters from "./Parameters"
import useInputs from "./useInputs"
import { Category, ClientIds, EventType, InstanceId, Parameter } from "./types"
import { eventsForCategory } from "./event"
import useUserProperties from "./useUserProperties"
import Items from "./Items"
import ValidateEvent from "./ValidateEvent"

export enum Label {
  APISecret = "api_secret",

  FirebaseAppID = "firebase_app_id",
  AppInstanceID = "app_instance_id",

  MeasurementID = "measurement_id",
  ClientID = "client_id",

  UserId = "user_id",

  EventCategory = "event_category",
  EventName = "event_name",
  TimestampMicros = "timestamp_micros",
  NonPersonalizedAds = "non_personalized_ads",

  Payload = "payload",
}

const ga4MeasurementProtocol = (
  <ExternalLink href={Url.ga4MeasurementProtocol}>
    GA4 Measurement Protocol
  </ExternalLink>
)

const useStyles = makeStyles(theme => ({
  clientSwitch: {
    marginBottom: theme.spacing(2),
  },
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
  parameters: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  items: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(3),
    },
    "&> :last-child": {
      marginTop: theme.spacing(1),
    },
  },
}))

export const EventCtx = React.createContext<
  | {
      eventName: string
      type: EventType
      parameters: Parameter[]
      items: Parameter[][] | undefined
      userProperties: Parameter[]
      timestamp_micros: string | undefined
      non_personalized_ads: boolean | undefined
      clientIds: ClientIds
      instanceId: InstanceId
      api_secret: string
    }
  | undefined
>(undefined)
export const ShowAdvancedCtx = React.createContext(false)
export const UseFirebaseCtx = React.createContext(false)

const EventBuilder: React.FC = () => {
  const formClasses = useFormStyles()
  const classes = useStyles()
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const {
    userProperties,
    addNumberUserProperty,
    addStringUserProperty,
    removeUserProperty,
    setUserPropertyName,
    setUserPopertyValue,
  } = useUserProperties()
  const {
    parameters,
    items,
    type,
    setType,
    eventName,
    setEventName,
    setParamName,
    setParamValue,
    addStringParam,
    addNumberParam,
    setItemParamName,
    setItemParamValue,
    removeParam,
    addItem,
    removeItem,
    addItemsParam,
    addItemNumberParam,
    addItemStringParam,
    removeItemParam,
    removeItems,
    categories,
  } = useEvent()

  const {
    useFirebase,
    setUseFirebase,
    category,
    setCategory,
    api_secret,
    setAPISecret,
    firebase_app_id,
    setFirebaseAppId,
    app_instance_id,
    setAppInstanceId,
    measurement_id,
    setMeasurementId,
    client_id,
    setClientId,
    user_id,
    setUserId,
    timestamp_micros,
    setTimestampMicros,
    non_personalized_ads,
    setNonPersonalizedAds,
  } = useInputs(categories)

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
      <WithHelpText
        notched
        shrink
        label="client"
        className={classes.clientSwitch}
      >
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>gtag.js</Grid>
          <Grid item>
            <Switch
              data-testid="use firebase"
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
      </WithHelpText>

      <Typography>
        After choosing a client, fill out the inputs below.
      </Typography>

      <section className={formClasses.form}>
        <LinkedTextField
          required
          href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#api_secret"
          linkTitle="See api_secret on devsite."
          value={api_secret || ""}
          label={Label.APISecret}
          id={Label.APISecret}
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
              label={Label.FirebaseAppID}
              id={Label.FirebaseAppID}
              helperText="The identifier for your firebase app."
              onChange={setFirebaseAppId}
            />
            <LinkedTextField
              required
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=firebase#app_instance_id"
              linkTitle="See app_instance_id on devsite."
              value={app_instance_id || ""}
              label={Label.AppInstanceID}
              id={Label.AppInstanceID}
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
              label={Label.MeasurementID}
              id={Label.MeasurementID}
              helperText="The identifier for your data stream."
              onChange={setMeasurementId}
            />
            <LinkedTextField
              required
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#client_id"
              linkTitle="See client_id on devsite."
              value={client_id || ""}
              label={Label.ClientID}
              id={Label.ClientID}
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
          label={Label.UserId}
          id={Label.UserId}
          helperText="The unique identifier for a given user."
          onChange={setUserId}
        />

        <Autocomplete<Category, false, true, true>
          data-testid={Label.EventCategory}
          fullWidth
          disableClearable
          autoComplete
          autoHighlight
          autoSelect
          options={Object.values(Category)}
          getOptionLabel={category => category}
          value={category}
          onChange={(_event, value) => {
            setCategory(value as Category)
            const events = eventsForCategory(value as Category)
            if (events.length > 0) {
              setType(events[0].type)
            }
          }}
          renderInput={params => (
            <TextField
              {...params}
              label={Label.EventCategory}
              id={Label.EventCategory}
              size="small"
              variant="outlined"
              helperText="The category for the event"
            />
          )}
        />
        {type === EventType.CustomEvent ? (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label={Label.EventName}
            id={Label.EventName}
            value={eventName}
            helperText="The name of the event"
            onChange={e => {
              setEventName(e.target.value)
            }}
          />
        ) : (
          <Autocomplete<EventType, false, true, true>
            data-testid={Label.EventName}
            fullWidth
            disableClearable
            autoComplete
            autoHighlight
            autoSelect
            options={eventsForCategory(category).map(e => e.type)}
            getOptionLabel={eventType => eventType}
            value={type}
            onChange={(_event, value) => {
              setType(value as EventType)
            }}
            renderInput={params => (
              <TextField
                {...params}
                label={Label.EventName}
                id={Label.EventName}
                size="small"
                variant="outlined"
                helperText={
                  <>
                    The name of the event. See{" "}
                    <ExternalLink
                      href={`https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#${type}`}
                    >
                      {type}
                    </ExternalLink>{" "}
                    on devsite.
                  </>
                }
              />
            )}
          />
        )}
        <LinkedTextField
          label={Label.TimestampMicros}
          id={Label.TimestampMicros}
          linkTitle="See timestamp_micros on devsite."
          href={`https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=${
            useFirebase ? "firebase" : "gtag"
          }#timestamp_micros`}
          value={timestamp_micros || ""}
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
            id={Label.NonPersonalizedAds}
          >
            {Label.NonPersonalizedAds}
          </LabeledCheckbox>
        </WithHelpText>
      </section>

      <Typography variant="h4">Event details</Typography>
      <Typography>
        Finally, specify the parameters to send with the event. By default, only
        recommended parameters for the event will appear here. Check "show
        advanced options" to add custom parameters or user properties.
      </Typography>
      <LabeledCheckbox checked={showAdvanced} onChange={setShowAdvanced}>
        show advanced options
      </LabeledCheckbox>

      <section className={formClasses.form}>
        <ShowAdvancedCtx.Provider
          value={showAdvanced || type === EventType.CustomEvent}
        >
          <Typography variant="h5">Parameters</Typography>
          <Parameters
            removeParam={removeParam}
            parameters={parameters}
            addStringParam={addStringParam}
            addNumberParam={addNumberParam}
            setParamName={setParamName}
            setParamValue={setParamValue}
            addItemsParam={items === undefined ? addItemsParam : undefined}
          />
          {items !== undefined && (
            <>
              <Typography variant="h5">Items</Typography>
              <Items
                items={items}
                addItem={addItem}
                removeItem={removeItem}
                removeItemParam={removeItemParam}
                addItemNumberParam={addItemNumberParam}
                addItemStringParam={addItemStringParam}
                setItemParamName={setItemParamName}
                setItemParamValue={setItemParamValue}
                removeItems={removeItems}
              />
            </>
          )}

          {(showAdvanced ||
            (userProperties !== undefined && userProperties.length !== 0)) && (
            <>
              <Typography variant="h5">User properties</Typography>
              <Parameters
                removeParam={removeUserProperty}
                parameters={userProperties}
                addStringParam={addStringUserProperty}
                addNumberParam={addNumberUserProperty}
                setParamName={setUserPropertyName}
                setParamValue={setUserPopertyValue}
              />
            </>
          )}
        </ShowAdvancedCtx.Provider>
      </section>

      <Typography variant="h3" className={classes.validateHeading}>
        Validate & Send event
      </Typography>
      <UseFirebaseCtx.Provider value={useFirebase}>
        <EventCtx.Provider
          value={{
            type,
            clientIds: useFirebase
              ? { app_instance_id, user_id }
              : { client_id, user_id },
            items,
            parameters,
            eventName,
            userProperties,
            timestamp_micros,
            non_personalized_ads,
            instanceId: useFirebase ? { firebase_app_id } : { measurement_id },
            api_secret: api_secret!,
          }}
        >
          <ValidateEvent
            client_id={client_id || ""}
            user_id={user_id || ""}
            api_secret={api_secret || ""}
            measurement_id={measurement_id || ""}
            app_instance_id={app_instance_id || ""}
            firebase_app_id={firebase_app_id || ""}
          />
        </EventCtx.Provider>
      </UseFirebaseCtx.Provider>
    </div>
  )
}

export default EventBuilder
