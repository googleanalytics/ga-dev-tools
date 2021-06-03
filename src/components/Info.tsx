import * as React from "react"
import { Paper, makeStyles } from "@material-ui/core"
import classnames from "classnames"
import { Info as InfoIcon } from "@material-ui/icons"
import blue from "@material-ui/core/colors/lightBlue"

interface InfoProps {
  className?: string
}

const useStyles = makeStyles(theme => ({
  info: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    minHeight: theme.spacing(10),
    alignItems: "center",
    backgroundColor: blue[100],
    // maxWidth: 930,
  },
  infoIcon: {
    margin: theme.spacing(0, 2),
  },
}))

const Info: React.FC<InfoProps> = ({ children, className }) => {
  const classes = useStyles()

  return (
    <Paper className={classnames(classes.info, className)}>
      <InfoIcon className={classes.infoIcon} />
      <section>{children}</section>
    </Paper>
  )
}

export default Info
