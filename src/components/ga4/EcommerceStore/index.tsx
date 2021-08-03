import { PAB, SAB } from "@/components/Buttons"
import { makeStyles, Typography } from "@material-ui/core"
import * as React from "react"

const useStyles = makeStyles(theme => ({
  storeWrapper: {
    // Each "spacing" value is ~16px but the point of it is to just have
    // uniform spacing of things.
    margin: theme.spacing(1),
  },
  controls: {
    "&> :not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}))

const EcommerceStore: React.FC = () => {
  const classes = useStyles()

  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    // when you need to make a network request, or need something that happens
    // async, use React.useEffect. It's a built in that will run the function
    // provided to it whenever the argument array (the last argument to
    // useEffect) changes. If you have an empty array, it'll just run once.
  }, [])

  const primaryAction = React.useCallback(() => {
    setCurrentTime(new Date())
  }, [])

  return (
    <section className={classes.storeWrapper}>
      <Typography>
        The typography component is used to keep the font-styles, etc consistent
        accross the site.
      </Typography>
      <Typography variant="h1">
        by changing the variant you can make it a heading{" "}
      </Typography>
      <Typography variant="body2">
        or a smaller body version. body1 is the default if not provided. . You
        also can bring in values via template literals which should always
        contain a javascript expression. The current time as an isoString is:{" "}
        {currentTime.toISOString()}
      </Typography>
      <section className={classes.controls}>
        <PAB onClick={primaryAction}>primary</PAB>
        <SAB>secondary</SAB>
      </section>
    </section>
  )
}

export default EcommerceStore
