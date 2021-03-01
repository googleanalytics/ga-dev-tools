import React from "react"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(_ => ({
  option: {
    display: "flex",
    width: "100%",
  },
  left: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
}))

type OptionProps = {
  right?: JSX.Element | string
}

export const FancyOption: React.FC<OptionProps> = ({ right, children }) => {
  const classes = useStyles()
  return (
    <div className={classes.option}>
      <div className={classes.left}>{children}</div>
      {right && right}
    </div>
  )
}
