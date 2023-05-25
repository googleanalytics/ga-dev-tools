import * as React from "react"
import { makeStyles } from "@material-ui/core"
import { Paper } from "@mui/material"

import classnames from "classnames"
import { Info as InfoIcon } from "@mui/icons-material"
import blue from "@mui/material/colors/lightBlue"

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
