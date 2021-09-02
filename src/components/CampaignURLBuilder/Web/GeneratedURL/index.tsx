import * as React from "react"

import clsx from "classnames"
import Paper from "@material-ui/core/Paper"
import { Error as ErrorIcon } from "@material-ui/icons"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import { GAVersion } from "@/constants"
import useFormStyles from "@/hooks/useFormStyles"
import useStyles from "../useStyles"
import WarningsFor from "./WarningsFor"
import useGenerateURL from "./useGenerateURL"
import ShortenLink from "@/components/ShortenLink"
import useInputs from "./useInputs"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { CopyIconButton } from "@/components/CopyButton"
import Warning from "@/components/Warning"

interface GeneratedURLProps {
  version: GAVersion
  websiteURL: string
  source: string
  medium: string
  campaign: string
  id: string
  term: string
  content: string
}

const GeneratedURL: React.FC<GeneratedURLProps> = ({
  version,
  websiteURL,
  source,
  medium,
  campaign,
  id,
  term,
  content,
}) => {
  const classes = useStyles()
  const formClasses = useFormStyles()

  const {
    useFragment,
    setUseFragment,
    shortened,
    setShortened,
    shortenError,
    setShortenError,
    hasWarning,
    setHasWarning,
  } = useInputs()

  const hasRequiredFields = React.useMemo(() => {
    if (version === GAVersion.UniversalAnalytics) {
      return [websiteURL, source].every(a => a !== undefined && a !== "")
    } else {
      return [websiteURL, source, medium].every(
        a => a !== undefined && a !== ""
      )
    }
  }, [version, websiteURL, source, medium])

  const generatedURL = useGenerateURL({
    setShortened,
    websiteURL,
    source,
    medium,
    campaign,
    id,
    term,
    content,
    useFragment,
  })

  return (
    <Paper className={clsx(classes.share, formClasses.form)}>
      <WarningsFor websiteURL={websiteURL} setHasWarning={setHasWarning} />
      {!hasWarning &&
        (hasRequiredFields ? (
          <>
            <Typography variant="h2">
              Share the generated campaign URL
            </Typography>

            <Typography variant="body1">
              Use this URL in any promotional channels you want to be associated
              with this custom campaign.
            </Typography>
            <TextField
              id="generated-url"
              label="generated URL"
              multiline
              value={generatedURL}
              variant="outlined"
              className={classes.generatedInput}
              InputProps={{
                endAdornment: (
                  <CopyIconButton
                    toCopy={generatedURL || ""}
                    tooltipText="Copy campaign URL."
                  />
                ),
              }}
            />
            <LabeledCheckbox checked={useFragment} setChecked={setUseFragment}>
              <Typography variant="body2" component="span">
                Set campaign parameters in the fragment portion of the URL (
                <Typography component="span" color="error" variant="inherit">
                  not recommended
                </Typography>
                )
              </Typography>
            </LabeledCheckbox>
            <section className={classes.shortened}>
              <TextField
                id="shortened-url"
                label="shortened URL"
                disabled={shortened === undefined}
                value={
                  shortened ||
                  "Click shorten link to shorten your generated URL."
                }
                size="small"
                variant="outlined"
                className={classes.generatedInput}
                InputProps={{
                  endAdornment: (
                    <CopyIconButton
                      disabled={shortened === undefined}
                      toCopy={shortened || ""}
                      tooltipText="Copy shortened URL."
                    />
                  ),
                }}
              />
              <div>
                <ShortenLink
                  disabled={shortened !== undefined}
                  medium
                  url={generatedURL}
                  setShortened={setShortened}
                  setError={setShortenError}
                />
              </div>
            </section>
            {shortenError && (
              <Warning>
                There was an error with shortening your URL: <br />{" "}
                {shortenError}
              </Warning>
            )}
          </>
        ) : (
          <section className={classes.shareInvalid}>
            <ErrorIcon />
            <Typography variant="body1">
              Fill out required fields above and a URL will be generated for you
              here.
            </Typography>
          </section>
        ))}
    </Paper>
  )
}

export default GeneratedURL
