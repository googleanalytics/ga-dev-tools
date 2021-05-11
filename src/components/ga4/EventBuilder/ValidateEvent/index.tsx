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

import green from "@material-ui/core/colors/green"
import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import clsx from "classnames"

import {
  ValidationMessage,
  MPEvent,
  ValidationStatus as ValidationStatusT,
  Parameters,
} from "../types"
import useFormStyles from "@/hooks/useFormStyles"
import EventPayloadInput from "./EventPayloadInput"
import ValidationStatus from "./ValidationStatus"
import EventActions from "./EventActions"

export interface ValidateEventProps {
  parameterizedUrl: string
  measurement_id: string
  app_instance_id: string
  firebase_app_id: string
  api_secret: string
  client_id: string
  user_id: string
  event: MPEvent
  validateEvent: () => void
  sendEvent: () => void
  payload: {}
  user_properties: Parameters
  validationStatus: ValidationStatusT
  validationMessages: ValidationMessage[]
}

const useStyles = makeStyles(theme => ({
  payloadTitle: {
    margin: theme.spacing(1, 0),
  },
  editEvent: {
    "&> *": {
      padding: theme.spacing(1, 2),
    },
  },
  validationStatus: ({ validationStatus }: ValidateEventProps) => {
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
  const formClasses = useFormStyles()
  const classes = useStyles(props)

  return (
    <Paper
      className={clsx(classes.editEvent, formClasses.form)}
      data-testid="validate and send"
    >
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
