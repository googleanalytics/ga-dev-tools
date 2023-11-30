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

import { styled } from '@mui/material/styles';

import clsx from "classnames"

import useValidateEvent from "./useValidateEvent"
import Loadable from "@/components/Loadable"
import Typography from "@mui/material/Typography"
import { PAB, PlainButton } from "@/components/Buttons"
import { Check, Warning, Error as ErrorIcon } from "@mui/icons-material"
import PrettyJson from "@/components/PrettyJson"
import usePayload from "./usePayload"
import { ValidationMessage } from "../types"
import Spinner from "@/components/Spinner"
import { EventCtx, Label } from ".."
import { Card } from "@mui/material"
import { green, red } from "@mui/material/colors"

const PREFIX = 'ValidateEvent';

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
  payloadErrors?: string | undefined
  useTextBox?: boolean
}

export interface ValidateEventProps {
  measurement_id: string
  app_instance_id: string
  firebase_app_id: string
  api_secret: string
  client_id: string
  user_id: string
  formatPayload: () => void
  payloadErrors: string | undefined
  useTextBox: boolean
}

const classes = {
  template: `${PREFIX}-template`,
  payloadTitle: `${PREFIX}-payloadTitle`,
  headers: `${PREFIX}-headers`,
  heading: `${PREFIX}-heading`,
  payload: `${PREFIX}-payload`,
  form: `${PREFIX}-form`,
  buttonRow: `${PREFIX}-buttonRow`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.template}`]: {
    padding: theme.spacing(2),
  },

  [`& .${classes.payloadTitle}`]: {
    margin: theme.spacing(1, 0),
  },

  [`& .${classes.headers}`]: {
    ...theme.typography.body2,
    fontFamily: "monospace",
  },

  [`& .${classes.heading}`]: ({ error, valid }: StyleProps) => ({
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

  [`& .${classes.form}`]: {
    maxWidth: "80ch",
  },

  [`& .${classes.buttonRow}`]: {
    display: "flex",
    "&> *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },

  [`& .${classes.payload}`]: {
    fontSize: theme.typography.caption.fontSize,
  }
}));

interface StyleProps {
  error?: boolean
  valid?: boolean
}


const focusFor = (message: ValidationMessage, useTextBox: boolean) => {
  const { fieldPath } = message
  let id: string | undefined
  const labelValues: string[] = Object.values(Label)

  if (labelValues.includes(fieldPath) && !useTextBox) {
    id = fieldPath
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
  payloadErrors,
  useTextBox
}) => {

  const { instanceId, api_secret } = useContext(EventCtx)!
  const payload = usePayload()
  return (
    <Card
      className={clsx(classes.form, classes.template)}
      data-testid="validate and send"
    >
      <Typography className={classes.heading} variant="h3">
        {headingIcon}
        {heading}
      </Typography>

      {validationMessages !== undefined &&
        (
          (useTextBox && !payloadErrors) ||
          !useTextBox
        ) && (
        <ul>
          {validationMessages.map((message, idx) => (
            <div>
              <li key={idx}>
                {focusFor(message, useTextBox !== undefined && useTextBox)}
                {message.description}
                <br />
                <a href={message.documentation} target='_blank' rel="noreferrer">Documentation</a>
              </li>
              <br/>
              <br/>
            </div>
          ))}
        </ul>
      )}

      {useTextBox && payloadErrors && (
        <div>
          <ul>
            <li>
              JSON formatting error: <i>{payloadErrors}</i>
            </li>
          </ul>
          <br/>
          <br/>
        </div>
      )}

      {body}

      <section className={classes.buttonRow}>
        {validateEvent !== undefined && (
          <PAB small onClick={() => {
            validateEvent()
          }
          }>
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

const ValidateEvent: React.FC<ValidateEventProps> = ({formatPayload, payloadErrors, useTextBox}) => {
  const request = useValidateEvent()

  return (
    <Loadable
      request={request}
      renderNotStarted={({ validateEvent }) => (
        <Template
          heading="This event has not been validated"
          headingIcon={<Warning />}
          body={
            <Root>
              <Typography>
                Update the event using the controls above.
              </Typography>
              <Typography>
                When you're done editing the event, click "Validate Event" to
                check if the event is valid.
              </Typography>
            </Root>
          }
          validateEvent={ () => {
              if (formatPayload) {
                formatPayload()
              }

              validateEvent()
            }
          }
        />
      )}
      renderInProgress={() => (
        <Template heading="Validating" body={<Spinner ellipses />} />
      )}
      renderFailed={({ validationMessages, validateEvent}) => (
        <Template
          error
          headingIcon={<ErrorIcon />}
          heading="Event is invalid"
          body=""
          validateEvent={ () => {
              if (formatPayload) {
                formatPayload()
              }

              validateEvent()
            }
          }
          validationMessages={validationMessages}
          payloadErrors={payloadErrors}
          useTextBox={useTextBox}
        />
      )}
      renderSuccessful={({ sendToGA, copyPayload, copySharableLink, sent}) => (
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
  );
}

export default ValidateEvent
