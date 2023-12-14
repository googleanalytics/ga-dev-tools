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

import Warning from "@mui/icons-material/Warning"
import ErrorIcon from "@mui/icons-material/Error"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Check from "@mui/icons-material/Check"
import Send from "@mui/icons-material/Send"
import Cached from "@mui/icons-material/Cached"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import {orange, green, yellow, red} from "@mui/material/colors"
import classnames from "classnames"

import { PAB } from "@/components/Buttons"
import CopyButton from "@/components/CopyButton"
import { ParametersAPI, Validation } from "./hooks"
const PREFIX = 'HitCard';

enum HitStatus {
  Unvalidated = "UNVALIDATED",
  Validating = "VALIDATING",
  Valid = "VALID",
  Invalid = "INVALID",
  Sent = "Sent",
  Sending = "Sending",
}

const classes = {
  hitElement: `${PREFIX}-hitElement`,
  hitElementActions: `${PREFIX}-hitElementActions`,
  addParameterButton: `${PREFIX}-addParameterButton`,
  validationStatus: `${PREFIX}-validationStatus`,
  httpInfo: `${PREFIX}-httpInfo`,
  payload: `${PREFIX}-payload`,
  hitStatusValidating: `${PREFIX}-hitStatus-${HitStatus.Validating}`,
  hitStatusSending: `${PREFIX}-hitStatus-${HitStatus.Sending}`,
  hitStatusInvalid: `${PREFIX}-hitStatus-${HitStatus.Invalid}`,
  hitStatusSent: `${PREFIX}-hitStatus-${HitStatus.Sent}`,
  hitStatusValid: `${PREFIX}-hitStatus-${HitStatus.Valid}`,
  hitStatusUnvalidated: `${PREFIX}-hitStatus-${HitStatus.Unvalidated}`
};

const Root = styled('div')((
    {
      theme
    }
) => ({
  [`& .${classes.hitElement}`]: {
    padding: theme.spacing(2, 3),
    display: "flex",
    flexDirection: "column",
  },

  [`&.${classes.hitElementActions}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    "& > button": {
      marginRight: theme.spacing(1),
    },
  },

  [`& .${classes.addParameterButton}`]: {
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.validationStatus}`]: {
    // Picked this value through a bit of trial and error, but having a
    // minHeight makes this not jump around during the "sending" and
    // "validating" states.
    minHeight: theme.spacing(24),
    margin: theme.spacing(-3, -3, 1, -3),
    padding: theme.spacing(0, 3),
    "& > span": {
      "& > svg": {
        fontSize: theme.typography.h1.fontSize,
      },
      "& > h3": {
        marginLeft: theme.spacing(1),
        fontSize: theme.typography.h2.fontSize,
      },
      display: "flex",
      alignItems: "center",
      marginTop: theme.spacing(1),
    },
  },

  [`& .${classes.httpInfo}`]: {
    margin: theme.spacing(1, 0, 2, 0),
    "& > span": {
      fontFamily: "'Source Code Pro', monospace",
    },
  },

  [`& .${classes.payload}`]: {
    flexGrow: 1,
  },
  [`& .${classes.hitStatusValidating}`]: {
    backgroundColor: orange[100],
    color: orange[900],
  },
  [`& .${classes.hitStatusSending}`]: {
    backgroundColor: orange[100],
    color: orange[900],
  },
  [`& .${classes.hitStatusInvalid}`]: {
    backgroundColor: red[100],
    color: red[900],
  },
  [`& .${classes.hitStatusSent}`]: {
    backgroundColor: green[100],
    color: green[900],
  },
  [`& .${classes.hitStatusValid}`]: {
    backgroundColor: green[100],
    color: green[900],
  },
  [`& .${classes.hitStatusUnvalidated}`]: {
    backgroundColor: yellow[100],
    color: yellow[900],
  },
}));

interface HitCardProps {
  hitPayload: string
  hitStatus: Validation["hitStatus"]
  validationMessages: Validation["validationMessages"]
  sendHit: Validation["sendHit"]
  validateHit: Validation["validateHit"]
  addParameter: ParametersAPI["addParameter"]
  hasParameter: ParametersAPI["hasParameter"]
  setParametersFromString: ParametersAPI["setParametersFromString"]
}

const HitCard: React.FC<HitCardProps> = ({
  validateHit,
  sendHit,
  hitPayload,
  hitStatus,
  validationMessages,
  addParameter,
  hasParameter,
  setParametersFromString,
}) => {

  const [value, setValue] = React.useState(hitPayload)

  // Update the localState of then input when the hitPayload changes.
  React.useEffect(() => {
    setValue(hitPayload)
  }, [hitPayload])

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      setParametersFromString(e.target.value)
    },
    [setParametersFromString]
  )
  return (
      <Root>
        <Paper className={classes.hitElement}>
          <ValidationStatus
            hasParameter={hasParameter}
            addParameter={addParameter}
            hitStatus={hitStatus}
            validationMessages={validationMessages}
          />
          <section className={classes.httpInfo}>
            <Typography variant="body2" component="span">
              POST /collect HTTP/1.1
            </Typography>
            <br />
            <Typography variant="body2" component="span">
              Host: www.google-analytics.com
            </Typography>
          </section>
          <TextField
            multiline
            variant="outlined"
            label="Hit payload"
            id="hit-payload"
            className={classes.payload}
            value={value}
            onChange={onChange}
          />
          <HitActions
            hitPayload={hitPayload}
            hitStatus={hitStatus}
            validateHit={validateHit}
            sendHit={sendHit}
          />
        </Paper>
      </Root>
  )
}

interface ValidationStatusProps {
  validationMessages: Validation["validationMessages"]
  hitStatus: Validation["hitStatus"]
  addParameter: ParametersAPI["addParameter"]
  hasParameter: ParametersAPI["hasParameter"]
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({
  validationMessages,
  hitStatus,
  addParameter,
  hasParameter,
}) => {


  let headerIcon: JSX.Element | null = null
  let hitHeading: JSX.Element | null = null
  let hitContent: JSX.Element[] | JSX.Element | null = null
  switch (hitStatus) {
    case HitStatus.Sent:
    case HitStatus.Valid: {
      headerIcon = <Check />
      hitHeading = <Typography variant="h3">Hit is valid!</Typography>
      hitContent = (
        <>
          <Typography variant="body1">
            Use the controls below to copy the hit or share it with coworkers.
          </Typography>
          <Typography>
            You can also send the hit to Google Analytics and watch it in action
            in the Real Time view.
          </Typography>
        </>
      )
      break
    }
    case HitStatus.Invalid: {
      headerIcon = <ErrorIcon />
      hitHeading = <Typography variant="h3">Hit is invalid!</Typography>
      hitContent = (
        <ul>
          {validationMessages.map(message => {
            let addParameterButton: JSX.Element | null = null
            if (
              message.code === "VALUE_REQUIRED" &&
              !hasParameter(message.param)
            ) {
              addParameterButton = (
                <Button
                  size="small"
                  className={classes.addParameterButton}
                  variant="contained"
                  onClick={() => addParameter(message.param)}
                >
                  Add {message.param}
                </Button>
              )
            }
            return (
              <li key={message.param}>
                <Typography>
                  {message.description}
                  {addParameterButton}
                </Typography>
              </li>
            )
          })}
        </ul>
      )
      break
    }
    case HitStatus.Sending:
    case HitStatus.Validating: {
      headerIcon = <Cached />
      hitHeading = (
        <Typography variant="h3">
          {hitStatus === HitStatus.Sending ? "Sending" : "Validating"} hit...
        </Typography>
      )
      break
    }
    case HitStatus.Unvalidated: {
      headerIcon = <Warning />
      hitHeading = (
        <Typography variant="h3">This hit has not been validated.</Typography>
      )
      hitContent = (
        <>
          <Typography variant="body1">
            You can update the hit using any of the controls below.
          </Typography>
          <Typography variant="body1">
            When you're done editing parameters, click the "Validate hit" button
            to make sure everything's OK.
          </Typography>
        </>
      )
      break
    }
    default: {
      throw new Error(`${hitStatus} has not been accounted for.`)
    }
  }
  return (
    <Paper
      square
      className={classnames(`${PREFIX}-hitStatus-${hitStatus}`, classes.validationStatus)}
    >
      <Typography component="span">
        {headerIcon}
        {hitHeading}
      </Typography>
      {hitContent}
    </Paper>
  )
}

interface HitActionsProps {
  hitPayload: string
  hitStatus: Validation["hitStatus"]
  validateHit: Validation["validateHit"]
  sendHit: Validation["sendHit"]
}

const HitActions: React.FC<HitActionsProps> = ({
  hitStatus,
  hitPayload,
  validateHit,
  sendHit,
}) => {


  switch (hitStatus) {
    case HitStatus.Sent:
    case HitStatus.Valid: {
      const sendHitButton = (
          <Root>
            <PAB
              startIcon={hitStatus === HitStatus.Sent ? <Check /> : <Send />}
              onClick={sendHit}
              className="Button Button--success Button-withIcon"
              variant="contained"
            >
              Send to GA
            </PAB>
          </Root>
      )

      const sharableLinkToHit =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        hitPayload
      return (
        <Root className={classes.hitElementActions}>
          {sendHitButton}
          <CopyButton
            toCopy={hitPayload}
            text="Copy payload"
            variant="contained"
          />
          <CopyButton
            toCopy={sharableLinkToHit}
            text="Copy link to this hit"
            variant="contained"
          />
        </Root>
      );
    }
    default: {
      return (
          <Root>
            <div className={classes.hitElementActions}>
              <PAB
                variant="contained"
                disabled={hitStatus === "VALIDATING"}
                onClick={validateHit}
              >
                {hitStatus === HitStatus.Validating
                  ? "Validating..."
                  : "Validate hit"}
              </PAB>
            </div>
          </Root>
      )
    }
  }
}

export default HitCard
