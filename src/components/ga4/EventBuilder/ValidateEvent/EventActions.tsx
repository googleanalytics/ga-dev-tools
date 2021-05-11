import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import Check from "@material-ui/icons/Check"
import Send from "@material-ui/icons/Send"

import { PAB } from "@/components/Buttons"
import CopyButton from "@/components/CopyButton"
import { ValidationStatus as ValidationStatusT } from "../types"
import { ValidateEventProps } from "."
import ValidateEventButton from "./ValidateEventButton"

const useStyles = makeStyles(theme => ({
  eventActions: {
    margin: theme.spacing(1, 0),
    "&> *": {
      marginRight: theme.spacing(1),
    },
  },
}))

const EventActions: React.FC<ValidateEventProps> = props => {
  const classes = useStyles()
  const {
    payload,
    validationStatus,
    validateEvent,
    sendEvent,
    parameterizedUrl,
  } = props

  const [eventSent, setEventSent] = React.useState<boolean>(false)
  React.useEffect(() => {
    setEventSent(false)
  }, [payload])

  const onClick = React.useCallback(async () => {
    sendEvent()
    setEventSent(true)
    new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    }).then(() => {
      setEventSent(false)
    })
  }, [sendEvent])

  if (validationStatus !== ValidationStatusT.Valid) {
    return (
      <section className={classes.eventActions}>
        <ValidateEventButton
          validationStatus={validationStatus}
          validateEvent={validateEvent}
        />
      </section>
    )
  }

  return (
    <section className={classes.eventActions}>
      <PAB startIcon={eventSent ? <Check /> : <Send />} onClick={onClick}>
        Send to GA
      </PAB>

      <CopyButton
        text="Copy payload"
        variant="outlined"
        color="secondary"
        toCopy={JSON.stringify(payload)}
      />
      <CopyButton
        variant="outlined"
        color="secondary"
        toCopy={parameterizedUrl}
        text="Copy sharable link"
      />
    </section>
  )
}

export default EventActions
