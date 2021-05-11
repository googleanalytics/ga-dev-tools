import * as React from "react"
import { makeStyles } from "@material-ui/core"
import clsx from "classnames"
import Typography from "@material-ui/core/Typography"

interface WithHelpTextProps {
  label?: string | JSX.Element | undefined
  helpText?: string | JSX.Element
  afterHelp?: JSX.Element
  className?: string
  notched?: boolean
}

interface Props {
  notched?: boolean
}
const useStyles = makeStyles(theme => ({
  withHelpText: ({ notched }: Props) => ({
    marginTop: notched ? theme.spacing(1.5) : "unset",
  }),
  helpText: {
    ...theme.typography.caption,
    marginTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.54)",
    marginLeft: theme.spacing(2),
    padding: "unset",
  },
  notchedContainer: {
    position: "relative",
  },
  fieldset: {
    position: "absolute",
    top: theme.spacing(-1.5),
    left: 0,
    right: 0,
    bottom: 0,
    color: "rgba(0, 0, 0, 0.54)",
    borderColor: "rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0),
    pointerEvents: "none",
    "&> legend": {
      ...theme.typography.caption,
    },
  },
  notchedChild: {
    padding: theme.spacing(1),
  },
}))

const WithHelpText: React.FC<WithHelpTextProps> = ({
  label,
  children,
  helpText,
  afterHelp,
  notched,
}) => {
  const classes = useStyles({ notched })
  return (
    <div className={classes.withHelpText}>
      <div className={clsx({ [classes.notchedContainer]: notched })}>
        {!notched && <label>{label}</label>}
        <div className={clsx({ [classes.notchedChild]: notched })}>
          {children}
        </div>
        {notched && (
          <fieldset className={classes.fieldset}>
            <legend>
              <span>{label}</span>
            </legend>
          </fieldset>
        )}
      </div>
      {helpText !== undefined && (
        <div>
          <Typography className={classes.helpText}>{helpText}</Typography>
          {afterHelp}
        </div>
      )}
    </div>
  )
}

export default WithHelpText
