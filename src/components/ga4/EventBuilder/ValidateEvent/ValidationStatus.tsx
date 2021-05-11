import * as React from "react"

import Check from "@material-ui/icons/Check"
import ErrorIcon from "@material-ui/icons/Error"
import Typography from "@material-ui/core/Typography"
import Warning from "@material-ui/icons/Warning"

import {
  ValidationMessage,
  ValidationStatus as ValidationStatusT,
} from "../types"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  heading: {
    display: "flex",
    alignItems: "center",
    "&> *:first-child": {
      marginRight: theme.spacing(1),
    },
  },
}))

interface Props {
  validationMessages: ValidationMessage[]
  validationStatus: ValidationStatusT
  className: string
}

const ValidationStatus: React.FC<Props> = ({
  validationMessages,
  validationStatus,
  className,
}) => {
  const classes = useStyles()
  const [headingText, icon, body] = React.useMemo(() => {
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
            <Typography></Typography>
          </>,
        ]
    }
  }, [validationStatus, validationMessages])

  return (
    <section className={className}>
      <Typography variant="h3" className={classes.heading}>
        {icon}
        {headingText}
      </Typography>
      <div>{body}</div>
    </section>
  )
}

export default ValidationStatus
