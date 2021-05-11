import * as React from "react"

import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles(theme => ({
  textarea: {
    width: "100%",
    padding: theme.spacing(1),
  },
}))

interface EventPayloadInputProps {
  payload: {}
}

const EventPayloadInput: React.FC<EventPayloadInputProps> = ({ payload }) => {
  const classes = useStyles()
  return (
    <TextareaAutosize
      className={classes.textarea}
      value={JSON.stringify(payload, undefined, "  ")}
      disabled
    />
  )
}

export default EventPayloadInput
