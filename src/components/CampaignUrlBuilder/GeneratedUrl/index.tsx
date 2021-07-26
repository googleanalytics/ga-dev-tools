import * as React from "react"

import Paper from "@material-ui/core/Paper"
import { Error as ErrorIcon } from "@material-ui/icons"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Button from "@material-ui/core/Button"

import { GAVersion } from "../../../constants"
import CopyButton from "../../../components/CopyButton"
import useStyles from "../useStyles"
import useShortenLink from "./useShortenLink"
import useWarningsFor from "./useWarningsFor"
import WarningsFor from "./WarningsFor"

interface GeneratedUrlProps {
  version: GAVersion
  websiteUrl: string
  source: string
  medium: string
  campaign: string
  id: string
  term: string
  content: string
}

const GeneratedURL: React.FC<GeneratedUrlProps> = ({
  version,
  websiteUrl,
  source,
  medium,
  campaign,
  id,
  term,
  content,
}) => {
  const classes = useStyles()

  const { authenticated, shorten, canShorten } = useShortenLink()
  const {
    problematicUrl,
    hasAllRequired,
    onWarning,
    showShort,
    shortLink,
    longLink,
    useFragment,
    setUseFragment,
    shortenLinkGui,
  } = useWarningsFor({
    version,
    websiteUrl,
    source,
    medium,
    campaign,
    id,
    shorten,
    content,
    term,
  })

  return (
    <Paper className={classes.share}>
      <WarningsFor websiteUrl={websiteUrl} onWarning={onWarning} />
      {!problematicUrl &&
        (hasAllRequired ? (
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
              value={showShort ? shortLink : longLink}
              variant="outlined"
              className={classes.generatedInput}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={useFragment}
                  onChange={e => setUseFragment(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" component="span">
                  Set campaign parameters in the fragment portion of the URL (
                  <Typography component="span" color="error" variant="inherit">
                    not recommended
                  </Typography>
                  )
                </Typography>
              }
            />
            <section className={classes.buttons}>
              <CopyButton
                variant="contained"
                color="primary"
                toCopy={showShort ? shortLink || "" : longLink}
                text="Copy URL"
              />
              {canShorten && (
                <Button
                  variant="contained"
                  onClick={shortenLinkGui}
                  data-testid="shorten-button"
                >
                  {authenticated === false
                    ? "Shorten URL"
                    : showShort
                    ? "Show original"
                    : "Shorten URL"}
                </Button>
              )}
            </section>
          </>
        ) : (
          <section className={classes.shareInvalid}>
            <ErrorIcon />
            <Typography variant="body1">
              Fill out all the required fields above and a URL will be
              automatically generated for you here.
            </Typography>
          </section>
        ))}
    </Paper>
  )
}

export default GeneratedURL
