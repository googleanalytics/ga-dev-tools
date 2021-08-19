import { makeStyles, useScrollTrigger } from "@material-ui/core"
import { ArrowUpward } from "@material-ui/icons"
import * as React from "react"
import { PlainButton } from "../Buttons"

const useStyles = makeStyles(theme => ({
  scrollToTop: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}))

const ScrollToTop = () => {
  const shouldScroll = useScrollTrigger({
    threshold: (window.screen.height || 200) / 2,
  })
  const classes = useStyles()

  const onClick = React.useCallback(() => {
    document.body.scrollIntoView({ behavior: "smooth" })
  }, [])

  if (!shouldScroll) {
    return null
  }

  return (
    <div className={classes.scrollToTop}>
      <PlainButton startIcon={<ArrowUpward />} onClick={onClick}>
        Back to Top
      </PlainButton>
    </div>
  )
}

export default ScrollToTop
