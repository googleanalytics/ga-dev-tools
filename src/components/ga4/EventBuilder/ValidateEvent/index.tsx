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

import React, { useContext } from "react"

import { makeStyles } from "@material-ui/core/styles"
import clsx from "classnames"

import useFormStyles from "@/hooks/useFormStyles"
import useValidateEvent from "./useValidateEvent"
import Loadable from "@/components/Loadable"
import Typography from "@material-ui/core/Typography"
import { PAB, PlainButton } from "@/components/Buttons"
import { Check, Warning, Error as ErrorIcon } from "@material-ui/icons"
import PrettyJson from "@/components/PrettyJson"
import usePayload from "./usePayload"
import { ValidationMessage } from "../types"
import Spinner from "@/components/Spinner"
import { EventCtx, Label } from ".."
import { Card } from "@material-ui/core"
import { green, red } from "@material-ui/core/colors"

interface StyleProps {
  error?: boolean
  valid?: boolean
}
const useStyles = makeStyles(theme => ({
  template: {
    padding: theme.spacing(2),
  },
  payloadTitle: {
    margin: theme.spacing(1, 0),
  },
  headers: {
    ...theme.typography.body2,
    fontFamily: "monospace",
  },
  heading: ({ error, valid }: StyleProps) => ({
    backgroundColor: error ? red[300] : valid ? green[300] : "inherit",
    color: error
      ? theme.palette.getContrastText(red[300])
      : valid
      ? theme.palette.getContrastText(green[300])
      : "inherit",
    margin: theme.spacing(-2),
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    "&> :first-child": {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(2),
  }),
  payload: {
    fontSize: theme.typography.caption.fontSize,
  },
}))

export interface ValidateEventProps {
  measurement_id: string
  app_instance_id: string
  firebase_app_id: string
  api_secret: string
  client_id: string
  user_id: string
}

const focusFor = (message: ValidationMessage) => {
  let id: string | undefined
  switch (message.fieldPath) {
    case "api_secret":
      id = Label.APISecret
      break
    case "measurement_id":
      id = Label.MeasurementID
      break
    case "firebase_app_id":
      id = Label.FirebaseAppID
      break
    case "app_instance_id":
      id = Label.AppInstanceID
      break
    case "client_id":
      id = Label.ClientID
      break
  }
  if (id) {
    return (
      <PlainButton
        style={{ marginRight: "8px" }}
        small
        onClick={() => {
          id && document.getElementById(id)?.focus()
        }}
      >
        focus
      </PlainButton>
    )
  }
}

interface TemplateProps {
  heading: string
  headingIcon?: JSX.Element
  body: JSX.Element | string
  validateEvent?: () => void
  validationMessages?: ValidationMessage[]
  sendToGA?: () => void
  copyPayload?: () => void
  copySharableLink?: () => void
  error?: boolean
  valid?: boolean
  sent?: boolean
}
const Template: React.FC<TemplateProps> = ({
  sent,
  heading,
  headingIcon,
  body,
  validateEvent,
  validationMessages,
  sendToGA,
  copyPayload,
  copySharableLink,
  error,
  valid,
}) => {
  const classes = useStyles({ error, valid })
  const payload = usePayload()
  const formClasses = useFormStyles()
  const { instanceId, api_secret } = useContext(EventCtx)!
  return (
    <Card
      className={clsx(formClasses.form, classes.template)}
      data-testid="validate and send"
    >
      <Typography className={classes.heading} variant="h3">
        {headingIcon}
        {heading}
      </Typography>
      {validationMessages !== undefined && (
        <ul>
          {validationMessages.map((message, idx) => (
            <li key={idx}>
              {focusFor(message)}
              {message.description}
            </li>
          ))}
        </ul>
      )}

      {body}

      <section className={formClasses.buttonRow}>
        {validateEvent !== undefined && (
          <PAB small onClick={validateEvent}>
            validate event
          </PAB>
        )}
        {sendToGA && (
          <PAB check={sent} onClick={sendToGA}>
            {sent ? "sent" : "send to ga"}
          </PAB>
        )}
        {copyPayload && (
          <PlainButton onClick={copyPayload}>copy payload</PlainButton>
        )}
        {copySharableLink && (
          <PlainButton onClick={copySharableLink}>
            copy sharable link
          </PlainButton>
        )}
      </section>
      <br />
      <Typography variant="h4">Request info</Typography>
      <Typography className={classes.headers}>
        POST /mp/collect?api_secret={api_secret}
        {instanceId.firebase_app_id &&
          `&firebase_app_id=${instanceId.firebase_app_id}`}
        {instanceId.measurement_id &&
          `&measurement_id=${instanceId.measurement_id}`}{" "}
        HTTP/1.1 <br />
        HOST: www.google-analytics.com <br />
        Content-Type: application/json
      </Typography>
      <Typography variant="h5">Payload</Typography>
      <section data-testid="payload">
        <PrettyJson
          className={classes.payload}
          noPaper
          object={payload}
          tooltipText="Copy payload"
        />
      </section>
    </Card>
  )
}

const ValidateEvent: React.FC<ValidateEventProps> = () => {
  const request = useValidateEvent()

  return (
    <Loadable
      request={request}
      renderNotStarted={({ validateEvent }) => (
        <Template
          heading="This event has not been validated"
          headingIcon={<Warning />}
          body={
            <>
              <Typography>
                Update the event using the controls above.
              </Typography>
              <Typography>
                When you're done editing the event, click "Validate Event" to
                check if the event is valid.
              </Typography>
            </>
          }
          validateEvent={validateEvent}
        />
      )}
      renderInProgress={() => (
        <Template heading="Validating" body={<Spinner ellipses />} />
      )}
      renderFailed={({ validationMessages, validateEvent }) => (
        <Template
          error
          headingIcon={<ErrorIcon />}
          heading="Event is invalid"
          body=""
          validateEvent={validateEvent}
          validationMessages={validationMessages}
        />
      )}
      renderSuccessful={({ sendToGA, copyPayload, copySharableLink, sent }) => (
        <Template
          sent={sent}
          valid
          heading="Event is valid"
          headingIcon={<Check />}
          sendToGA={sendToGA}
          copyPayload={copyPayload}
          copySharableLink={copySharableLink}
          body={
            <>
              <Typography>
                Use the controls below to copy the event payload or share it
                with coworkers.
              </Typography>
              <Typography>
                You can also send the event to Google Analytics and watch it in
                action in the Real Time view.
              </Typography>
            </>
          }
        />
      )}
    />
  )
}

export default ValidateEvent
