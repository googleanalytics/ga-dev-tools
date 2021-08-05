import * as React from "react"

import { Warning } from "@material-ui/icons"
import Typography from "@material-ui/core/Typography"
import { v4 as uuid } from "uuid"

import InlineCode from "@/components/InlineCode"
import { Url } from "@/constants"
import useStyles from "../useStyles"

const iosCampaignTracking = (
  <a href={Url.iosCampaignMeasurement}>iOS Campaign Tracking URL Builder</a>
)

const googlePlayURLBuilder = (
  <a href={Url.googlePlayURLBuilder}>Google Play URL Builder</a>
)

interface WarningsForProps {
  websiteURL: string
  onWarning: (warningPresent: boolean) => void
}
const WarningsFor: React.FC<WarningsForProps> = ({ websiteURL, onWarning }) => {
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

  const [warnings, setWarnings] = React.useState<JSX.Element[]>([])

  React.useEffect(() => {
    setWarnings([])
    if (asURL?.hostname === "ga-dev-tools.web.app") {
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

    if (
      websiteURL.startsWith("localhost") ||
      websiteURL.startsWith("127.0.0.1") ||
      asURL?.hostname === "localhost"
    ) {
      setWarnings(old =>
        old.concat([
          <>
            You can't create a campaign url to a local-only site. Use your
            publically accessible URL.
          </>,
        ])
      )
    }

    if (asURL?.hostname === "play.google.com") {
      setWarnings(old =>
        old.concat([
          <>
            It appears that you are creating a Google Play Store url. You should
            use the {googlePlayURLBuilder} instead for creating campaign links
            for Play Store apps.
          </>,
        ])
      )
    }

    if (asURL?.hostname === "itunes.apple.com") {
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
  }, [asURL, websiteURL])

  React.useEffect(() => {
    onWarning(warnings.length !== 0)
  }, [warnings, onWarning])

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
