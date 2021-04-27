import * as React from "react"
import { makeStyles } from "@material-ui/core"

interface WithHelpTextProps {
  label?: string | JSX.Element | undefined
  helpText: string | JSX.Element
  afterHelp?: JSX.Element
  className?: string
}

const useStyles = makeStyles(theme => ({
  helpText: {
    display: "flex",
    marginLeft: theme.spacing(1.75),
    alignItems: "flex-start",
    "& > :first-child": {
      flexGrow: 1,
    },
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
    "& > p": {
      ...theme.typography.caption,
      color: theme.palette.text.secondary,
    },
  },
}))

const WithHelpText: React.FC<WithHelpTextProps> = ({
  className,
  label,
  children,
  helpText,
  afterHelp,
}) => {
  const classes = useStyles()
  return (
    <div className={className}>
      <label>{label}</label>
      {children}
      <div className={classes.helpText}>
        {helpText}
        {afterHelp}
      </div>
    </div>
  )
}

export default WithHelpText
