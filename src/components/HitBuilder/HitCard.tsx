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

import Warning from "@material-ui/icons/Warning"
import ErrorIcon from "@material-ui/icons/Error"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Check from "@material-ui/icons/Check"
import Send from "@material-ui/icons/Send"
import Cached from "@material-ui/icons/Cached"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import orange from "@material-ui/core/colors/orange"
import green from "@material-ui/core/colors/green"
import yellow from "@material-ui/core/colors/yellow"
import red from "@material-ui/core/colors/red"
import classnames from "classnames"

import { PAB } from "@/components/Buttons"
import CopyButton from "@/components/CopyButton"
import { ParametersAPI, Validation } from "./hooks"
import { HitStatus } from "./types"

const useStyles = makeStyles(theme => ({
  hitElement: {
    padding: theme.spacing(2, 3),
    display: "flex",
    flexDirection: "column",
  },
  hitElementActions: {
    marginTop: theme.spacing(2),
    display: "flex",
    "& > button": {
      marginRight: theme.spacing(1),
    },
  },
  addParameterButton: {
    marginLeft: theme.spacing(1),
  },
  validationStatus: {
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
  [HitStatus.Validating]: {
    backgroundColor: orange[100],
    color: orange[900],
  },
  [HitStatus.Sending]: {
    backgroundColor: orange[100],
    color: orange[900],
  },
  [HitStatus.Invalid]: {
    backgroundColor: red[100],
    color: red[900],
  },
  [HitStatus.Sent]: {
    backgroundColor: green[100],
    color: green[900],
  },
  [HitStatus.Valid]: {
    backgroundColor: green[100],
    color: green[900],
  },
  [HitStatus.Unvalidated]: {
    backgroundColor: yellow[100],
    color: yellow[900],
  },
  httpInfo: {
    margin: theme.spacing(1, 0, 2, 0),
    "& > span": {
      fontFamily: "'Source Code Pro', monospace",
    },
  },
  payload: {
    flexGrow: 1,
  },
}))

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
  const classes = useStyles()
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
  const classes = useStyles()

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
      className={classnames(classes[hitStatus], classes.validationStatus)}
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
  const classes = useStyles()

  switch (hitStatus) {
    case HitStatus.Sent:
    case HitStatus.Valid: {
      const sendHitButton = (
        <PAB
          startIcon={hitStatus === HitStatus.Sent ? <Check /> : <Send />}
          onClick={sendHit}
          className="Button Button--success Button-withIcon"
          variant="contained"
        >
          Send to GA
        </PAB>
      )

      const sharableLinkToHit =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        hitPayload
      return (
        <div className={classes.hitElementActions}>
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
        </div>
      )
    }
    default: {
      return (
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
      )
    }
  }
}

export default HitCard
