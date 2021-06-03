import * as React from "react"
import { makeStyles } from "@material-ui/core"
import clsx from "classnames"
import Typography from "@material-ui/core/Typography"
import useFormStyles from "@/hooks/useFormStyles"

interface WithHelpTextProps {
  label?: string | JSX.Element | undefined
  helpText?: string | JSX.Element
  afterHelp?: JSX.Element
  className?: string
  notched?: boolean
  shrink?: boolean
  hrGroup?: boolean
}

interface Props {
  notched?: boolean
  shrink?: boolean
}
const useStyles = makeStyles(theme => ({
  withHelpText: ({ notched, shrink }: Props) => ({
    marginTop: notched ? theme.spacing(1.5) : "unset",
    ...(shrink ? { display: "flex" } : {}),
  }),
  helpText: {
    ...theme.typography.caption,
    marginTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.54)",
    marginLeft: theme.spacing(2),
    padding: "unset",
  },
  shrunk: {
    flexShrink: 1,
  },
  notchedContainer: ({ shrink }: Props) => ({
    position: "relative",
    ...(shrink ? {} : { width: "100%" }),
  }),
  label: {
    color: "rgba(0, 0, 0, 0.54)",
    ...theme.typography.caption,
    marginBottom: theme.spacing(1),
  },
  legend: {
    color: "rgba(0, 0, 0, 0.54)",
    ...theme.typography.caption,
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
  hr: ({ shrink }: Props) => ({
    ...(shrink ? {} : { width: "100%" }),
  }),
  hrChildren: {
    "&> :last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
}))

const WithHelpText: React.FC<WithHelpTextProps> = ({
  label,
  children,
  helpText,
  afterHelp,
  notched,
  shrink,
  className,
  hrGroup,
}) => {
  const classes = useStyles({ notched, shrink })
  const formClasses = useFormStyles()
  if (hrGroup) {
    return (
      <div className={clsx(classes.hr, className)}>
        <div className={formClasses.verticleHr}>
          <hr />
          <div>
            <legend className={classes.legend}>{label}</legend>
            <div className={classes.hrChildren}>
              {children}
              {helpText !== undefined && (
                <div>
                  <Typography className={classes.helpText}>
                    {helpText}
                  </Typography>
                  {afterHelp}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={clsx(classes.withHelpText, className)}>
      <div
        className={clsx({
          [classes.notchedContainer]: notched,
          [classes.shrunk]: shrink,
        })}
      >
        {!notched && <label className={classes.label}>{label}</label>}
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
