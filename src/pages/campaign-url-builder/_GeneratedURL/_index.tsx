import * as React from "react"
import useStyles from "../_useStyles"
import { usePersistentBoolean } from "../../../hooks"
import { StorageKey } from "../../../constants"
import useShortenLink from "./_useShortenLink"
import { websiteUrlFor } from "../_params"
import Paper from "@material-ui/core/Paper"
import { Error as ErrorIcon } from "@material-ui/icons"
import WarningsFor from "./_WarningsFor"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import CopyButton from "../../../components/CopyButton"
import Button from "@material-ui/core/Button"

interface GeneratedUrlProps {
  websiteUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
}

const GeneratedURL: React.FC<GeneratedUrlProps> = ({
  websiteUrl,
  source,
  medium,
  campaign,
  term,
  content,
}) => {
  const classes = useStyles()

  const [generatedUrl, setGeneratedUrl] = React.useState("")
  const [hasAllRequired, setHasAllRequired] = React.useState(false)
  const [problematicUrl, setProblematicUrl] = React.useState(false)
  const [longLink, setLongLink] = React.useState<string>(generatedUrl)
  const [shortLink, setShortLink] = React.useState<undefined | string>()
  const [showShort, setShowShort] = React.useState(false)
  const [useFragment, setUseFragment] = usePersistentBoolean(
    StorageKey.campaignBuilderUseFragment,
    false
  )
  const { authenticated, shorten, canShorten } = useShortenLink()

  const shortenLinkGui = React.useCallback(() => {
    if (showShort === true) {
      // We're currently showing the short url and the user clicked "Show full
      // URL". Set show short to false and return.
      setShowShort(false)
      return
    }
    // We can't shorten bit.ly links or links that are empty.
    if (longLink === "" || longLink?.startsWith("https://bit.ly")) {
      return
    }
    shorten(longLink).then(({ longLink, shortLink }) => {
      setLongLink(longLink)
      setShortLink(shortLink)
      setShowShort(true)
    })
  }, [longLink, shorten, showShort])

  React.useEffect(() => {
    if (websiteUrl === "") {
      setHasAllRequired(false)
      return
    }
    if (source === "") {
      setHasAllRequired(false)
      return
    }
    if (medium === "") {
      setHasAllRequired(false)
      return
    }
    if (campaign === "") {
      setHasAllRequired(false)
      return
    }
    setHasAllRequired(true)
  }, [websiteUrl, source, medium, campaign])

  const setGeneratedFromInput = React.useCallback(() => {
    if (!hasAllRequired) {
      setGeneratedUrl("")
      setLongLink("")
      return
    }
    const generated = websiteUrlFor(
      websiteUrl,
      {
        utm_source: source || undefined,
        utm_medium: medium || undefined,
        utm_campaign: campaign || undefined,
        utm_term: term || undefined,
        utm_content: content || undefined,
      },
      useFragment
    )
    setGeneratedUrl(generated)
    setLongLink(generated)
  }, [
    hasAllRequired,
    useFragment,
    websiteUrl,
    source,
    medium,
    campaign,
    term,
    content,
  ])
  // TODO - this can probably be fixed with useMemo based on what past me said:
  // This is a bit of a hack, but I don't want to duplicate the code that sets
  // the generated url.
  React.useEffect(() => {
    setGeneratedFromInput()
    setShortLink(undefined)
    setShowShort(false)
  }, [
    hasAllRequired,
    setGeneratedFromInput,
    useFragment,
    websiteUrl,
    source,
    medium,
    campaign,
    term,
    content,
  ])

  const onWarning = React.useCallback(
    warningPresent => setProblematicUrl(warningPresent),
    [setProblematicUrl]
  )

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
              label="Generated URL"
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
                  Set campaign parameters in the fragment protion of the URL (
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
