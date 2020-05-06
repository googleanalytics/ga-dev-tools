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

import React from "react"
import actions from "./_actions"
import { HitStatus, ValidationMessage, State } from "./_types"
import { useSelector, useDispatch } from "react-redux"
import Warning from "@material-ui/icons/Warning"
import Error from "@material-ui/icons/Error"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import CopyButton from "../../components/CopyButton"
import Check from "@material-ui/icons/Check"
import Send from "@material-ui/icons/Send"
import { Paper, makeStyles, Typography } from "@material-ui/core"
import classnames from "classnames"

const useStyles = makeStyles(theme => ({
  hitElement: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  validationStatus: {
    margin: theme.spacing(-3, -3, 1, -3),
    padding: theme.spacing(0, 3, 0, 3),
  },
  validationHeader: {
    display: "flex",
    alignItems: "center",
  },
  [HitStatus.Valid]: {},
  [HitStatus.Unvalidated]: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.getContrastText(theme.palette.warning.main),
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

const HitCard: React.FC = () => {
  const hitStatus = useSelector<State, HitStatus>(a => a.hitStatus)
  const classes = useStyles()
  const hitPayload = useSelector<State, string>(a => a.hitPayload)
  const [value, setValue] = React.useState(hitPayload)
  const [editing, setIsEditing] = React.useState(false)
  const dispatch = useDispatch()
  const updateHit = React.useCallback(
    (newHit: string) => {
      dispatch(actions.updateHit(newHit))
    },
    [dispatch]
  )

  // Update the localState of then input when the hitPayload changes.
  React.useEffect(() => {
    setValue(hitPayload)
  }, [hitPayload])

  React.useEffect(() => {
    // if (editing) {
    //   $("body").addClass("is-editing")
    // } else {
    //   $("body").removeClass("is-editing")
    // }
  }, [editing])

  const onFocus = React.useCallback(() => {
    setIsEditing(true)
  }, [])

  const onBlur = React.useCallback(() => {
    setIsEditing(false)
    updateHit(value)
  }, [value])

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
    },
    []
  )
  return (
    <Paper className={classes.hitElement}>
      <ValidationStatus />
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
        className={classes.payload}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="HitElement-body">
        <HitActions />
      </div>
    </Paper>
  )
}

const ValidationStatus: React.FC = () => {
  const classes = useStyles()
  const validationMessages = useSelector<State, ValidationMessage[]>(
    a => a.validationMessages
  )
  const hitStatus = useSelector<State>(a => a.hitStatus)
  switch (hitStatus) {
    case "VALID":
      return (
        <header className="HitElement-status">
          <span className="HitElement-statusIcon">
            <Check />
          </span>
          <div className="HitElement-statusBody">
            <h1 className="HitElement-statusHeading">Hit is valid!</h1>
            <p className="HitElement-statusMessage">
              Use the controls below to copy the hit or share it with coworkers.
              <br />
              You can also send the hit to Google Analytics and watch it in
              action in the Real Time view.
            </p>
          </div>
        </header>
      )
    case "INVALID":
      return (
        <header className="HitElement-status">
          <span className="HitElement-statusIcon">
            <Error />
          </span>
          <div className="HitElement-statusBody">
            <h1 className="HitElement-statusHeading">Hit is invalid!</h1>
            <ul className="HitElement-statusMessage">
              {validationMessages.map(message => (
                <li key={message.param}>{message.description}</li>
              ))}
            </ul>
          </div>
        </header>
      )
    default:
      return (
        <Paper
          square
          className={classnames(classes[hitStatus], classes.validationStatus)}
        >
          <Typography variant="h2" className={classes.validationHeader}>
            <Warning />
            This hit has not been validated
          </Typography>
          <Typography>
            You can update the hit using any of the controls below.
          </Typography>
          <Typography>
            When you're done, click the "Validate hit" button to make sure
            everything's OK.
          </Typography>
        </Paper>
      )
  }
}

const HitActions: React.FC = () => {
  const hitStatus = useSelector<State, HitStatus>(a => a.hitStatus)
  const hitPayload = useSelector<State, string>(a => a.hitPayload)
  const [hitSent, setHitSent] = React.useState<boolean>(false)
  React.useEffect(() => {
    setHitSent(false)
  }, [hitPayload])

  /**
   * Sends the hit payload to Google Analytics and updates the button state
   * to indicate the hit was successfully sent. After 1 second the button
   * gets restored to its original state.
   */
  const sendHit = React.useCallback(async () => {
    await fetch("https://www.google-analytics.com/collect", {
      method: "POST",
      body: hitPayload,
    })
    setHitSent(true)
    // gaAll("send", "event", {
    //   eventCategory: "Hit Builder",
    //   eventAction: "send",
    //   eventLabel: "payload",
    // })
    // await sleep(ACTION_TIMEOUT)
    setHitSent(false)
  }, [hitPayload])

  const dispatch = useDispatch()
  const validateHit = React.useCallback(() => {
    dispatch(actions.validateHit)
  }, [dispatch])

  if (hitStatus != "VALID") {
    const buttonText = (hitStatus == "INVALID" ? "Rev" : "V") + "alidate hit"

    return (
      <div className="HitElement-action">
        <Button
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
