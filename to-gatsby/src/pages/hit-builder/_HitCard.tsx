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
import { HitStatus, ValidationMessage } from "./_types"
import Warning from "@material-ui/icons/Warning"
import Error from "@material-ui/icons/Error"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import CopyButton from "../../components/CopyButton"
import Check from "@material-ui/icons/Check"
import Send from "@material-ui/icons/Send"
import Cached from "@material-ui/icons/Cached"
import { Paper, makeStyles, Typography } from "@material-ui/core"
import classnames from "classnames"
import green from "@material-ui/core/colors/green"
import yellow from "@material-ui/core/colors/yellow"
import red from "@material-ui/core/colors/red"

const useStyles = makeStyles(theme => ({
  hitElement: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  validationStatus: {
    margin: theme.spacing(-3, -3, 1, -3),
    padding: theme.spacing(0, 3, 3, 3),
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
      marginTop: theme.spacing(3),
    },
  },
  [HitStatus.Invalid]: {
    backgroundColor: red[100],
    color: red[900],
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

const ACTION_TIMEOUT = 1500

interface HitCardProps {
  hitPayload: string
  hitStatus: HitStatus
  validationMessages: ValidationMessage[]
  sendHit: () => void
  validateHit: () => void
  addParameter: (paramName: string) => void
  hasParameter: (paramName: string) => boolean
  setParametersFromString: (paramString: string) => void
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
    []
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
      <div className="HitElement-body">
        <HitActions
          hitPayload={hitPayload}
          hitStatus={hitStatus}
          validateHit={validateHit}
          sendHit={sendHit}
        />
      </div>
    </Paper>
  )
}

interface ValidationStatusProps {
  validationMessages: ValidationMessage[]
  hitStatus: HitStatus
  addParameter: (paramName: string) => void
  hasParameter: (paramName: string) => boolean
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({
  validationMessages,
  hitStatus,
  addParameter,
  hasParameter,
}) => {
  const classes = useStyles()

  let headerIcon
  let hitHeading
  let hitContent
  switch (hitStatus) {
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
      headerIcon = <Error />
      hitHeading = <Typography variant="h3">Hit is invalid!</Typography>
      hitContent = validationMessages.map(message => {
        console.log({ message })
        let addParameterButton: JSX.Element | null = null
        if (message.code === "VALUE_REQUIRED" && !hasParameter(message.param)) {
          addParameterButton = (
            <Button
              variant="contained"
              onClick={() => addParameter(message.param)}
            >
              Add {message.param}
            </Button>
          )
        }
        return (
          <li key={message.param}>
            {message.description} {addParameterButton}
          </li>
        )
      })
      break
    }
    case HitStatus.Validating: {
      headerIcon = <Cached />
      hitHeading = <Typography variant="h3">Validiting hit...</Typography>
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
            When you're done, click the "Validate hit" button to make sure
            everything's OK.
          </Typography>
        </>
      )
      break
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
  hitStatus: HitStatus
  hitPayload: string
  validateHit: () => void
  sendHit: () => void
}

const HitActions: React.FC<HitActionsProps> = ({
  hitStatus,
  hitPayload,
  validateHit,
  sendHit,
}) => {
  const [hitSent, setHitSent] = React.useState<boolean>(false)
  React.useEffect(() => {
    setHitSent(false)
  }, [hitPayload])

  // /**
  //  * Sends the hit payload to Google Analytics and updates the button state
  //  * to indicate the hit was successfully sent. After 1 second the button
  //  * gets restored to its original state.
  //  */
  // const sendHit = React.useCallback(async () => {
  //   await fetch("https://www.google-analytics.com/collect", {
  //     method: "POST",
  //     body: hitPayload,
  //   })
  //   setHitSent(true)
  //   // gaAll("send", "event", {
  //   //   eventCategory: "Hit Builder",
  //   //   eventAction: "send",
  //   //   eventLabel: "payload",
  //   // })
  //   // await sleep(ACTION_TIMEOUT)
  //   setHitSent(false)
  // }, [hitPayload])

  if (hitStatus != "VALID") {
    const buttonText = (hitStatus == "INVALID" ? "Rev" : "V") + "alidate hit"

    return (
      <div className="HitElement-action">
        <Button
          variant="contained"
          className="Button Button--action"
          disabled={hitStatus === "VALIDATING"}
          onClick={validateHit}
        >
          {hitStatus === "VALIDATING" ? "Validating..." : buttonText}
        </Button>
      </div>
    )
  }

  const sendHitButton = (
    <Button
      startIcon={hitSent ? <Check /> : <Send />}
      onClick={sendHit}
      className="Button Button--success Button-withIcon"
    >
      Send hit to Google Analytics
    </Button>
  )

  const sharableLinkToHit =
    location.protocol +
    "//" +
    location.host +
    location.pathname +
    "?" +
    hitPayload
  return (
    <div className="HitElement-action">
      <div className="ButtonSet">
        {sendHitButton}
        <CopyButton toCopy={hitPayload} text="Copy hit payload" />
        <CopyButton
          toCopy={sharableLinkToHit}
          text="Copy sharable link to hit"
        />
      </div>
    </div>
  )
}

export default HitCard
