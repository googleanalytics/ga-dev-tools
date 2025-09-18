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

import { styled } from '@mui/material/styles';

import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Autocomplete from "@mui/material/Autocomplete"
import Refresh from "@mui/icons-material/Refresh"
import { Error as ErrorIcon } from "@mui/icons-material"

import LinkedTextField from "@/components/LinkedTextField"
import TextBox from "@/components/TextBox"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import Grid from "@mui/material/Grid"
import Switch from "@mui/material/Switch"
import ExternalLink from "@/components/ExternalLink"
import { Url } from "@/constants"
import WithHelpText from "@/components/WithHelpText"
import { TooltipIconButton } from "@/components/Buttons"
import useEvent from "./useEvent"
import Parameters from "./Parameters"
import useInputs from "./useInputs"
import { Category, ClientIds, EventType, InstanceId, Parameter, Label } from "./types"
import { eventsForCategory } from "./event"
import useUserProperties from "./useUserProperties"
import Items from "./Items"
import ValidateEvent from "./ValidateEvent"
import { PlainButton } from "@/components/Buttons"
import { useEffect } from "react"
import GeographicInformation from "./GeographicInformation";
import DeviceInformation from "./DeviceInformation";

const PREFIX = 'EventBuilder';

const classes = {
  clientSwitch: `${PREFIX}-clientSwitch`,
  unifiedParameters: `${PREFIX}-unifiedParameters`,
  fullWidth: `${PREFIX}-fullWidth`,
  parameterPair: `${PREFIX}-parameterPair`,
  validateHeading: `${PREFIX}-validateHeading`,
  parameters: `${PREFIX}-parameters`,
  form: `${PREFIX}-form`,
  items: `${PREFIX}-items`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.clientSwitch}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.unifiedParameters}`]: {},

  [`& .${classes.fullWidth}`]: {
    width: "100%",
  },

  [`& .${classes.parameterPair}`]: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.validateHeading}`]: {
    marginTop: theme.spacing(3),
  },

  [`& .${classes.parameters}`]: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },

  [`& .${classes.form}`]: {
    maxWidth: "80ch",
  },

  [`& .${classes.items}`]: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(3),
    },
    "&> :last-child": {
      marginTop: theme.spacing(1),
    },
  }
}));

const ga4MeasurementProtocol = (
  <ExternalLink href={Url.ga4MeasurementProtocol}>
    GA4 Measurement Protocol
  </ExternalLink>
)

export type EventPayload = {
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
  useTextBox: boolean
  payloadObj: any
  ip_override: string | undefined
  user_agent: string | undefined
  user_location: {
    city: string | undefined
    region_id: string | undefined
    country_id: string | undefined
    subcontinent_id: string | undefined
    continent_id: string | undefined
  }
  device: {
    category: string | undefined
    language: string | undefined
    screen_resolution: string | undefined
    operating_system: string | undefined
    operating_system_version: string | undefined
    model: string | undefined
    brand: string | undefined
    browser: string | undefined
    browser_version: string | undefined
  }
}
export const EventCtx = React.createContext<
  | EventPayload
  | undefined
>(undefined)
export const ShowAdvancedCtx = React.createContext(false)
export const UseFirebaseCtx = React.createContext(false)

const EventBuilder: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const {
    userProperties,
    addNumberUserProperty,
    addStringUserProperty,
    removeUserProperty,
    setUserPropertyName,
    setUserPropertyValue,
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
    useTextBox,
    setUseTextBox,
    inputPayload,
    setInputPayload,
    payloadObj,
    setPayloadObj,
    payloadErrors,
    setPayloadErrors,
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

  const eventOptions = React.useMemo(
    () => eventsForCategory(category, useFirebase),
    [category, useFirebase]
  )

  const [user_location_city, setUserLocationCity] = React.useState("")
  const [user_location_region_id, setUserLocationRegionId] = React.useState("")
  const [user_location_country_id, setUserLocationCountryId] = React.useState("")
  const [user_location_subcontinent_id, setUserLocationSubcontinentId] = React.useState("")
  const [user_location_continent_id, setUserLocationContinentId] = React.useState("")
  const [ip_override, setIpOverride] = React.useState("")

  const [device_category, setDeviceCategory] = React.useState("")
  const [device_language, setDeviceLanguage] = React.useState("")
  const [device_screen_resolution, setDeviceScreenResolution] = React.useState("")
  const [device_operating_system, setDeviceOperatingSystem] = React.useState("")
  const [device_operating_system_version, setDeviceOperatingSystemVersion] = React.useState("")
  const [device_model, setDeviceModel] = React.useState("")
  const [device_brand, setDeviceBrand] = React.useState("")
  const [device_browser, setDeviceBrowser] = React.useState("")
  const [device_browser_version, setDeviceBrowserVersion] = React.useState("")
  const [user_agent, setUserAgent] = React.useState("")

  const formatPayload = React.useCallback(() => {
    try {
      if (inputPayload) {
        let payload = JSON.parse(inputPayload) as object
        setPayloadObj(JSON.stringify(payload, null, "\t"))
        setPayloadErrors("")
      } else {
        setPayloadErrors("Empty Payload")
        setPayloadObj(JSON.stringify(payload, null, "\t"))
        setPayloadErrors("")
      }
    } catch (err: any) {
      setPayloadErrors(err.message)
      setPayloadObj({})
    }
  }, [inputPayload, setPayloadErrors, setPayloadObj])

  useEffect(() => {
    formatPayload()
  }, [inputPayload, formatPayload])

  return (
    <Root>
      <Typography variant="h3">Overview</Typography>
      <Typography component={'span'}>
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
                const newUseFirebase = e.target.checked
                setUseFirebase(newUseFirebase)

                if (!e.target.checked) {
                  setUseTextBox(false)
                }

                // Always reset the event type when the client changes.
                const newOptions = eventsForCategory(category, newUseFirebase)
                if (newOptions.length > 0) {
                  setType(newOptions[0].type)
                } else {
                  // If the new client has no events for this category, switch to Custom.
                  setCategory(Category.Custom)
                  setType(EventType.CustomEvent)
                }
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
    {

        <>
          <WithHelpText
            notched
            shrink
            label="validation method"
            className="formatTab"
          >
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>form</Grid>
              <Grid item>
                <Switch
                  data-testid="use form"
                  checked={useTextBox}
                  onChange={e => {
                    setUseTextBox(e.target.checked)
                  }}
                  name="use form"
                  color="primary"
                />
              </Grid>
              <Grid item>text box</Grid>
            </Grid>
          </WithHelpText>

          <br/>
        </>

    }

    { useTextBox &&
        <>
        <TextBox
          required
          href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=firebase#payload_post_body"
          linkTitle="JSON Payload Documentation"
          value={Object.keys(payloadObj).length > 0 ? payloadObj : inputPayload}
          label={Label.Payload}
          onChange={(input) => {
              setInputPayload(input)
              formatPayload()
            }
          }
        />

        <br/>

        <br/>

        <PlainButton small
          onClick={formatPayload}
        >
          format payload
        </PlainButton>

        { payloadErrors && (
            <TooltipIconButton
              tooltip={payloadErrors}
              placement={'top'}
            >
              <ErrorIcon
                style={{color: 'red'}}
              />
            </TooltipIconButton>
        )}
      </>
    }

    { !useTextBox &&
      <div>
        <section className={classes.form}>


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
              const newOptions = eventsForCategory(
                value as Category,
                useFirebase
              )
              if (newOptions.length > 0) {
                setType(newOptions[0].type)
              } else {
                setCategory(Category.Custom)
                setType(EventType.CustomEvent)
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
              options={eventOptions.map(e => e.type)}
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
                      The name of the event.
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
          advanced options" to add custom parameters, user properties, or geographic 
          information.
        </Typography>
        <LabeledCheckbox checked={showAdvanced} onChange={setShowAdvanced}>
          show advanced options
        </LabeledCheckbox>

      <section className={classes.form}>
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
            (userProperties !== undefined &&
              userProperties.length !== 0)) && (
            <>
              <Typography variant="h5">User properties</Typography>
              <Parameters
                removeParam={removeUserProperty}
                parameters={userProperties}
                addStringParam={addStringUserProperty}
                addNumberParam={addNumberUserProperty}
                setParamName={setUserPropertyName}
                setParamValue={setUserPropertyValue}
              />
            </>
          )}
          {showAdvanced && (
            <UseFirebaseCtx.Provider value={useFirebase}>
              <GeographicInformation
                user_location_city={user_location_city}
                setUserLocationCity={setUserLocationCity}
                user_location_region_id={user_location_region_id}
                setUserLocationRegionId={setUserLocationRegionId}
                user_location_country_id={user_location_country_id}
                setUserLocationCountryId={setUserLocationCountryId}
                user_location_subcontinent_id={
                  user_location_subcontinent_id
                }
                setUserLocationSubcontinentId={
                  setUserLocationSubcontinentId
                }
                user_location_continent_id={user_location_continent_id}
                setUserLocationContinentId={setUserLocationContinentId}
                ip_override={ip_override}
                setIpOverride={setIpOverride}
              />
              <DeviceInformation
                device_category={device_category}
                setDeviceCategory={setDeviceCategory}
                device_language={device_language}
                setDeviceLanguage={setDeviceLanguage}
                device_screen_resolution={device_screen_resolution}
                setDeviceScreenResolution={setDeviceScreenResolution}
                device_operating_system={device_operating_system}
                setDeviceOperatingSystem={setDeviceOperatingSystem}
                device_operating_system_version={
                  device_operating_system_version
                }
                setDeviceOperatingSystemVersion={
                  setDeviceOperatingSystemVersion
                }
                device_model={device_model}
                setDeviceModel={setDeviceModel}
                device_brand={device_brand}
                setDeviceBrand={setDeviceBrand}
                device_browser={device_browser}
                setDeviceBrowser={setDeviceBrowser}
                device_browser_version={device_browser_version}
                setDeviceBrowserVersion={setDeviceBrowserVersion}
                user_agent={user_agent}
                setUserAgent={setUserAgent}
              />
            </UseFirebaseCtx.Provider>
          )}
            </ShowAdvancedCtx.Provider>
          </section>
        </div>
      }
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
            useTextBox,
            payloadObj,
            instanceId: useFirebase ? { firebase_app_id } : { measurement_id },
            api_secret: api_secret!,
            user_agent,
            ip_override,
            user_location: {
              city: user_location_city,
              region_id: user_location_region_id,
              country_id: user_location_country_id,
              subcontinent_id: user_location_subcontinent_id,
              continent_id: user_location_continent_id,
            },
            device: {
              category: device_category,
              language: device_language,
              screen_resolution: device_screen_resolution,
              operating_system: device_operating_system,
              operating_system_version: device_operating_system_version,
              model: device_model,
              brand: device_brand,
              browser: device_browser,
              browser_version: device_browser_version,
            },
          }}
        >
          <ValidateEvent
            client_id={client_id || ""}
            user_id={user_id || ""}
            api_secret={api_secret || ""}
            measurement_id={measurement_id || ""}
            app_instance_id={app_instance_id || ""}
            firebase_app_id={firebase_app_id || ""}
            formatPayload={formatPayload}
            payloadErrors={payloadErrors}
            useTextBox={useTextBox}
          />
        </EventCtx.Provider>
      </UseFirebaseCtx.Provider>
    </Root>
  )
}

export default EventBuilder
