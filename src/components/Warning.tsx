import * as React from "react"
import { Paper } from "@mui/material"
import { makeStyles } from "@material-ui/core"
import classnames from "classnames"
import { Warning as WarningIcon } from "@mui/icons-material"
import red from "@mui/material/colors/red"

interface WarningProps {
  className?: string
}

const useStyles = makeStyles(theme => ({
  warning: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    minHeight: theme.spacing(10),
    alignItems: "center",
    backgroundColor: red[100],
  },
  warningIcon: {
    margin: theme.spacing(0, 2),
  },
}))

const Warning: React.FC<WarningProps> = ({ children, className }) => {
  const classes = useStyles()

  return (
    <Paper className={classnames(classes.warning, className)}>
      <WarningIcon className={classes.warningIcon} />
      <section>{children}</section>
    </Paper>
  )
}

export default Warning
