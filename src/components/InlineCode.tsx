import * as React from "react"
import { makeStyles, Typography } from "@material-ui/core"
import classnames from "classnames"

const useStyles = makeStyles(theme => ({
  code: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.spacing(0.25),
    fontFamily: "'Source Code Pro', monospace",
  },
}))

const InlineCode: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const classes = useStyles()
  return (
    <Typography
      className={classnames(classes.code, className)}
      variant="body2"
      component="span"
    >
      {children}
    </Typography>
  )
}

export default InlineCode
