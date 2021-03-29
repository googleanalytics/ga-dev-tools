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

/* global $ */

import React, { useMemo } from "react"
// import Textarea from "react-textarea-autosize"
import {
  ValidationMessage,
  MPEvent,
  ValidationStatus as ValidationStatusT,
  Parameters,
} from "./_types/_index"
import {
  makeStyles,
  Theme,
  Typography,
  Button,
  Paper,
  TextareaAutosize,
} from "@material-ui/core"
import { Check, Error as ErrorIcon, Warning, Send } from "@material-ui/icons"
import green from "@material-ui/core/colors/green"
import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"

interface ValidateEventProps {
  measurement_id: string
  app_instance_id: string
  firebase_app_id: string
  api_secret: string
  client_id: string
  user_id: string
  event: MPEvent
  validateEvent: () => void
  payload: {}
  user_properties: Parameters
  validationStatus: ValidationStatusT
  validationMessages: ValidationMessage[]
}

// const ACTION_TIMEOUT = 1500

const useStyles = makeStyles<Theme, ValidateEventProps>(theme => ({
  payloadTitle: {
    margin: theme.spacing(1, 0),
  },
  editEvent: {
    "& > *": {
      padding: theme.spacing(1, 2),
    },
  },
  validationStatus: ({ validationStatus }) => {
    const baseColor =
      validationStatus === ValidationStatusT.Invalid
        ? red
        : validationStatus === ValidationStatusT.Unset ||
          validationStatus === ValidationStatusT.Pending
        ? grey
        : green
    return {
      backgroundColor: baseColor[100],
      border: `1px solid ${baseColor[500]}`,
      borderTopLeftRadius: theme.spacing(1),
      borderTopRightRadius: theme.spacing(1),
      "&> h2 > svg": {
        marginRight: theme.spacing(1),
      },
    }
  },
}))

const ValidateEvent: React.FC<ValidateEventProps> = props => {
  const {
    measurement_id,
    firebase_app_id,
    api_secret,
    validationStatus,
    validationMessages,
    payload,
  } = props
  const classes = useStyles(props)

  return (
    <Paper className={classes.editEvent}>
      <ValidationStatus
        className={classes.validationStatus}
        validationStatus={validationStatus}
        validationMessages={validationMessages}
      />
      <div className="HitElement-body">
        <div className="HitElement-requestInfo">
          POST /mp/collect?
          {measurement_id !== ""
            ? `measurement_id=${measurement_id}`
            : firebase_app_id !== ""
            ? `firebase_app_id=${firebase_app_id}`
            : "measurement_id="}
          &api_secret={api_secret} HTTP/1.1
          <br />
          Host: www.google-analytics.com
        </div>
        <div className="HitElement-requestBody">
          <div className="FormControl FormControl--full">
            <div className="FormControl-body">
              <Typography className={classes.payloadTitle} variant="h4">
                Payload:
              </Typography>
              <EventPayloadInput payload={payload} />
            </div>
          </div>
        </div>
        <EventActions {...props} payload={payload} />
      </div>
    </Paper>
  )
}

export default ValidateEvent

const ValidationStatus: React.FC<{
  validationMessages: ValidationMessage[]
  validationStatus: ValidationStatusT
  className: string
}> = ({ validationMessages, validationStatus, className }) => {
  const [headingText, icon, body] = useMemo(() => {
    switch (validationStatus) {
      case ValidationStatusT.Valid:
        return [
          "Event is valid!",
          <Check />,
          <>
            <Typography>
              Use the controls below to copy the event payload or share it with
              coworkers.
            </Typography>
            <Typography>
              You can also send the event to Google Analytics and watch it in
              action in the Real Time view.
            </Typography>
          </>,
        ]
      case ValidationStatusT.Invalid:
        return [
          "Event is invalid!",
          <ErrorIcon />,
          <>
            <ul className="HitElement-statusMessage">
              {validationMessages.map(message => (
                <li key={message.fieldPath}>{message.description}</li>
              ))}
            </ul>
          </>,
        ]
      default:
        return [
          "This event has not yet been validated",
          <Warning />,

          <>
            <Typography>
              You can update the event using any of the controls below.
            </Typography>
            <Typography>
              When you're done, click the "Validate Event" button to make sure
              everything's OK.
            </Typography>
          </>,
        ]
    }
  }, [validationStatus])

  return (
    <section className={className}>
      <Typography variant="h2">
        {icon}
        {headingText}
      </Typography>
      <div>{body}</div>
    </section>
  )
}

const EventActions: React.FC<ValidateEventProps> = props => {
  const { payload, validationStatus, validateEvent } = props
  // const linkToEvent = useMemo(() => parameterizedUrl({}), [])

  const [eventSent, setEventSent] = React.useState<boolean>(false)
  React.useEffect(() => {
    setEventSent(false)
  }, [payload])

  /**
   * Sends the event payload to Google Analytics and updates the button state
   * to indicate the event was successfully sent. After 1 second the button
   * gets restored to its original state.
   */
  const sendEvent = React.useCallback(async () => {
    // TODO reimplement this functionality.
    // dispatch(actions.sendEvent)
    setEventSent(true)
    // gaAll("send", "event", {
    //   eventCategory: "App+Web Event Builder",
    //   eventAction: "send",
    //   eventLabel: "payload",
    // })
    // TODO - figure out ui pause here.
    // await sleep(ACTION_TIMEOUT)
    setEventSent(false)
  }, [payload])

  if (validationStatus !== ValidationStatusT.Valid) {
    return (
      <ValidateEventButton
        validationStatus={validationStatus}
        validateEvent={validateEvent}
      />
    )
  }

  const sendEventButton = (
    <Button startIcon={eventSent ? <Check /> : <Send />} onClick={sendEvent}>
      Send event to Google Analytics
    </Button>
  )

  // TODO - Figure out copy-paste. (use existing solution)
  // if (supports.copyToClipboard()) {
  //   return (
  //     <div className="HitElement-action">
  //       <div className="ButtonSet">
  //         {sendEventButton}
  //         <CopyButton
  //           textToCopy={JSON.stringify(payload)}
  //           type="content-paste"
  //           appPlusWeb
  //         >
  //           Copy event payload
  //         </CopyButton>
  //         <CopyButton type="link" textToCopy={linkToEvent} appPlusWeb link>
  //           Copy sharable link to event
  //         </CopyButton>
  //       </div>
  //     </div>
  //   )
  // } else {
  return <div className="HitElement-action">{sendEventButton}</div>
  // }
}

interface ValidateEventButtonProps {
  validationStatus: ValidationStatusT
  validateEvent: () => void
}

const useStylesValidateButton = makeStyles(theme => ({
  validateButton: {
    margin: theme.spacing(1, 0),
  },
}))

const ValidateEventButton: React.FC<ValidateEventButtonProps> = ({
  validationStatus,
  validateEvent,
}) => {
  const classes = useStylesValidateButton()
  let buttonText: string
  switch (validationStatus) {
    case ValidationStatusT.Invalid:
      buttonText = "Revalidate event"
      break
    case ValidationStatusT.Pending:
      buttonText = "Validating..."
      break
    default:
      buttonText = "Validate event"
      break
  }

  return (
    <Button
      className={classes.validateButton}
      variant="contained"
      color="primary"
      disabled={validationStatus === ValidationStatusT.Pending}
      onClick={validateEvent}
    >
      {buttonText}
    </Button>
  )
}

const useStylesPayloadInput = makeStyles(theme => ({
  textarea: {
    width: "100%",
    padding: theme.spacing(1),
  },
}))

const EventPayloadInput: React.FC<{ payload: {} }> = ({ payload }) => {
  const classes = useStylesPayloadInput()
  return (
    <TextareaAutosize
      className={classes.textarea}
      value={JSON.stringify(payload, undefined, "  ")}
      disabled
    />
  )
}
