import * as React from "react"
import { useTheme, makeStyles } from "@material-ui/core"
import {Circles} from "react-loader-spinner"

const useStyles = makeStyles(() => ({
  loadingIndicator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}))

interface SpinnerProps {
  ellipses?: boolean
}

const Spinner: React.FC<SpinnerProps> = ({ children, ellipses }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <section className={classes.loadingIndicator}>
      {children}
      {ellipses && <>&hellip;</>}
      <Circles color={theme.palette.primary.main} />
    </section>
  )
}

export default Spinner
