import * as React from "react"
import { useTheme, makeStyles } from "@material-ui/core"
import Loader from "react-loader-spinner"

const useStyles = makeStyles(() => ({
  loadingIndicator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}))

const Spinner: React.FC = ({ children }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <section className={classes.loadingIndicator}>
      {children}
      <Loader type="Circles" color={theme.palette.primary.main} />
    </section>
  )
}

export default Spinner
