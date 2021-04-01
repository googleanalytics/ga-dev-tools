import * as React from "react"
import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  code: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.spacing(0.25),
    fontFamily: "'Source Code Pro', monospace",
  },
}))

const InlineCode: React.FC = ({ children }) => {
  const classes = useStyles()
  return (
    <Typography className={classes.code} variant="body2" component="span">
      {children}
    </Typography>
  )
}

export default InlineCode
