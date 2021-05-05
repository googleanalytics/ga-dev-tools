import * as React from "react"
import { useTheme, makeStyles } from "@material-ui/core"
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

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
      <Loader type="Circles" color={theme.palette.primary.main} />
    </section>
  )
}

export default Spinner
