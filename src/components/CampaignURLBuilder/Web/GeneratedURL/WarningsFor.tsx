import * as React from "react"

import { Warning } from "@material-ui/icons"
import Typography from "@material-ui/core/Typography"
import { v4 as uuid } from "uuid"

import InlineCode from "@/components/InlineCode"
import { Url } from "@/constants"
import useStyles from "../useStyles"
import { Dispatch } from "@/types"

const iosCampaignTracking = (
  <a href={Url.iosCampaignMeasurement}>iOS Campaign Tracking URL Builder</a>
)

const googlePlayURLBuilder = (
  <a href={Url.googlePlayURLBuilder}>Google Play URL Builder</a>
)

interface WarningsForProps {
  websiteURL: string
  setHasWarning: Dispatch<boolean>
}
const WarningsFor: React.FC<WarningsForProps> = ({
  websiteURL,
  setHasWarning,
}) => {
  const classes = useStyles()
  const asURL = React.useMemo<URL | undefined>(() => {
    try {
      return new URL(websiteURL)
    } catch (e) {
      return undefined
    }
  }, [websiteURL])

  const BaseWarning: React.FC = ({ children }) => {
    return (
      <section className={classes.shareInvalid}>
        <Warning />
        <Typography variant="body1">{children}</Typography>
      </section>
    )
  }

  const warnings = React.useMemo(() => {
    let w: JSX.Element[] = []
    if (asURL === undefined) {
      w = w.concat([<>The website URL provided is not a valid URL.</>])
    }
    if (asURL?.hostname === "ga-dev-tools.web.app") {
      w = w.concat([
        <>
          You are linking to this site (
          <InlineCode>ga-dev-tools.web.app</InlineCode>) instead of your own.
          You should put your own site's URL in the Website URL field, above.
        </>,
      ])
    }

    if (asURL?.hostname === "play.google.com") {
      w = w.concat([
        <>
          It appears that you are creating a Google Play Store url. You should
          use the {googlePlayURLBuilder} instead for creating campaign links for
          Play Store apps.
        </>,
      ])
    }

    if (asURL?.hostname === "itunes.apple.com") {
      w = w.concat([
        <>
          It appears you are creating an iOS App Store URL. You should use the{" "}
          {iosCampaignTracking} instead for creating campaign links for Play
          Store apps.
        </>,
      ])
    }
    return w
  }, [asURL])

  React.useEffect(() => {
    if (warnings.length !== 0) {
      setHasWarning(true)
    } else {
      setHasWarning(false)
    }
  }, [warnings, setHasWarning])

  if (warnings.length === 0) {
    return null
  }

  return (
    <section data-testid="bad-url-warnings">
      {warnings.map(childElement => (
        <BaseWarning key={uuid()}>{childElement}</BaseWarning>
      ))}
    </section>
  )
}

export default WarningsFor
