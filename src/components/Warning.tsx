import * as React from "react"
import { Paper, makeStyles } from "@material-ui/core"
import classnames from "classnames"
import { Warning as WarningIcon } from "@material-ui/icons"
import red from "@material-ui/core/colors/red"

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
