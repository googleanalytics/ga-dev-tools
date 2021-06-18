import * as React from "react"

import { Warning } from "@material-ui/icons"
import Typography from "@material-ui/core/Typography"
import { v4 as uuid } from "uuid"

import InlineCode from "../../../components/InlineCode"
import { Url } from "../../../constants"
import useStyles from "../useStyles"

const iosCampaignTracking = (
  <a href={Url.iosCampaignMeasurement}>iOS Campaign Tracking URL Builder</a>
)

const googlePlayUrlBuilder = (
  <a href={Url.googlePlayURLBuilder}>Google Play URL Builder</a>
)

interface WarningsForProps {
  websiteUrl: string
  onWarning: (warningPresent: boolean) => void
}
const WarningsFor: React.FC<WarningsForProps> = ({ websiteUrl, onWarning }) => {
  const classes = useStyles()
  const asUrl = React.useMemo<URL | undefined>(() => {
    try {
      return new URL(websiteUrl)
    } catch (e) {
      return undefined
    }
  }, [websiteUrl])

  const BaseWarning: React.FC = ({ children }) => {
    return (
      <section className={classes.shareInvalid}>
        <Warning />
        <Typography variant="body1">{children}</Typography>
      </section>
    )
  }

  const [warnings, setWarnings] = React.useState<JSX.Element[]>([])

  React.useEffect(() => {
    if (asUrl === undefined) {
      return
    }
    // Clear out the old value.
    setWarnings([])
    if (asUrl.hostname === "ga-dev-tools.web.app") {
      setWarnings(old =>
        old.concat([
          <>
            You are linking to this site (
            <InlineCode>ga-dev-tools.web.app</InlineCode>) instead of your own.
            You should put your own site's URL in the Website URL field, above.
          </>,
        ])
      )
    }

    if (asUrl.hostname === "play.google.com") {
      setWarnings(old =>
        old.concat([
          <>
            It appears that you are creating a Google Play Store url. You should
            use the {googlePlayUrlBuilder} instead for creating campaign links
            for Play Store apps.
          </>,
        ])
      )
    }

    if (asUrl.hostname === "itunes.apple.com") {
      setWarnings(old =>
        old.concat([
          <>
            It appears you are creating an iOS App Store URL. You should use the{" "}
            {iosCampaignTracking} instead for creating campaign links for Play
            Store apps.
          </>,
        ])
      )
    }
  }, [asUrl])

  React.useEffect(() => {
    onWarning(warnings.length !== 0)
  }, [warnings, onWarning])

  if (asUrl === undefined) {
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
