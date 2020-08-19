// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { makeStyles } from "@material-ui/core/styles"
import Error from "@material-ui/icons/ErrorOutline"
import Warning from "@material-ui/icons/Warning"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Button from "@material-ui/core/Button"
import { useLocalStorage } from "react-use"
import { v4 as uuid } from "uuid"

import { Url, StorageKey } from "../../constants"
import Layout from "../../components/layout"
import CopyButton from "../../components/CopyButton"
import useShortenLink from "./_useShortenLink"
import { extractParamsFromWebsiteUrl, websiteUrlFor } from "./_params"

const iosCampaignTracking = (
  <a href={Url.iosCampaignTracking}>iOS Campaign Tracking URL Builder</a>
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
    if (asUrl.hostname === "ga-dev-tools.appspot.com") {
      setWarnings(old =>
        old.concat([
          <>
            It appears that you are linking to this site,{" "}
            <Code>ga-dev-tools.appspot.com</Code>, instead of your own. You
            should put your own site's URL in the Website URL field, above.{" "}
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

const Code: React.FC = ({ children }) => {
  const classes = useStyles()
  return (
    <Typography className={classes.code} variant="body2" component="span">
      {children}
    </Typography>
  )
}

const useStyles = makeStyles(theme => ({
  bitlyIcon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  generatedInput: {
    wordBreak: "break-all",
  },
  code: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.spacing(0.25),
    fontFamily: "'Source Code Pro', monospace",
  },
  denseTableCell: {
    whiteSpace: "nowrap",
    "& p": {
      paddingBottom: theme.spacing(0.5),
    },
  },
  buttons: {
    display: "flex",
    "& > button": {
      margin: theme.spacing(1),
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
  },
  bold: {
    fontWeight: "bold",
  },
  share: {
    padding: theme.spacing(3),
    paddingTop: "unset",
    display: "flex",
    flexDirection: "column",
  },
  shareInvalid: {
    display: "flex",
    flexDirection: "row",
    paddingTop: theme.spacing(3),
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(2),
    },
    "& p": {
      paddingBottom: "unset",
    },
  },
}))

const customCampaigns = <a href={Url.customCampaigns}>Custom Campaigns</a>

interface GeneratedUrlProps {
  websiteUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
}

const GeneratedUrl: React.FC<GeneratedUrlProps> = ({
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
  const [useFragment, setUseFragment] = useLocalStorage(
    StorageKey.campaignBuilderUseFragment,
    false,
    {
      raw: false,
      serializer: a => a.toString(),
      deserializer: a => a === "true",
    }
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
                    ? "Convert URL to Short Link (authorization required)"
                    : showShort
                    ? "Show full URL"
                    : "Convert URL to Short Link"}
                </Button>
              )}
            </section>
          </>
        ) : (
          <section className={classes.shareInvalid}>
            <Error />
            <Typography variant="body1">
              Fill out all the required fields above and a URL will be
              automatically generated for you here.
            </Typography>
          </section>
        ))}
    </Paper>
  )
}

export const CampaignUrlBuilder = () => {
  // TODO - Add support for shortlinks.
  const classes = useStyles()
  const [websiteUrl, setWebsiteUrl] = useLocalStorage(
    StorageKey.campaignBuilderWebsiteUrl,
    ""
  )
  const [source, setSource] = useLocalStorage(
    StorageKey.campaignBuilderSource,
    ""
  )
  const [medium, setMedium] = useLocalStorage(
    StorageKey.campaignBuilderMedium,
    ""
  )
  const [campaign, setCampaign] = useLocalStorage(
    StorageKey.campaignBuilderName,
    ""
  )
  const [term, setTerm] = useLocalStorage(StorageKey.campaignBuilderTerm, "")
  const [content, setContent] = useLocalStorage(
    StorageKey.campaignBuilderContent,
    ""
  )

  const onWebsiteChange = React.useCallback(
    e => {
      const extractedParams = extractParamsFromWebsiteUrl(e.target.value)
      if (extractedParams !== undefined) {
        const {
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
        } = extractedParams
        utm_source !== undefined && setSource(utm_source)
        utm_medium !== undefined && setMedium(utm_medium)
        utm_campaign !== undefined && setCampaign(utm_campaign)
        utm_term !== undefined && setTerm(utm_term)
        utm_content !== undefined && setContent(utm_content)
      }
      setWebsiteUrl(e.target.value)
    },
    [setCampaign, setMedium, setSource, setTerm, setContent, setWebsiteUrl]
  )

  return (
    <>
      <Typography variant="body1">
        This tool allows you to easily add campaign parameters to URLs so you
        can track {customCampaigns} in Google Analytics.
      </Typography>
      <Typography variant="h3">
        Enter the website URL and campaign information
      </Typography>
      <section className={classes.inputs}>
        <TextField
          id="website-url"
          required
          value={websiteUrl}
          onChange={onWebsiteChange}
          label="Website URL"
          helperText={
            <span>
              The full website URL (e.g.{" "}
              <span className={classes.bold}>https://www.example.com</span>)
            </span>
          }
        />
        <TextField
          id="campaign-source"
          required
          value={source}
          onChange={e => setSource(e.target.value)}
          label="Campaign Source"
          helperText={
            <span>
              The referrer (e.g. <span className={classes.bold}>google</span>,{" "}
              <span className={classes.bold}>newsletter</span>)
            </span>
          }
        />
        <TextField
          id="campaign-medium"
          required
          value={medium}
          onChange={e => setMedium(e.target.value)}
          label="Campaign Medium"
          helperText={
            <span>
              Marketing medium (e.g. <span className={classes.bold}>cpc</span>,{" "}
              <span className={classes.bold}>banner</span>,{" "}
              <span className={classes.bold}>email</span>)
            </span>
          }
        />
        <TextField
          id="campaign-name"
          required
          value={campaign}
          onChange={e => setCampaign(e.target.value)}
          label="Campaign Name"
          helperText={
            <span>
              Product, promo code, or slogan (e.g.{" "}
              <span className={classes.bold}>spring_sale</span>)
            </span>
          }
        />
        <TextField
          id="campaign-term"
          value={term}
          onChange={e => setTerm(e.target.value)}
          label="Campaign Term"
          helperText="Identify the paid keywords"
        />
        <TextField
          id="campaign-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          label="Campaign Content"
          helperText="Use to differentiate ads"
        />
      </section>

      <GeneratedUrl
        {...{ source, websiteUrl, medium, campaign, term, content }}
      />

      <Typography variant="h2">
        More information and examples for each parameter
      </Typography>
      <Typography variant="body1">
        The following table gives a detailed explanation and example of each of
        the campaign parameters:
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Parameter</TableCell>
            <TableCell>Required</TableCell>
            <TableCell>Example</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Source</Typography>
              <Code>utm_source</Code>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Yes</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <Code>google</Code>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Use <Code>utm_source</Code> to identify a search engine,
                newsletter name, or other source.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Medium</Typography>
              <Code>utm_medium</Code>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Yes</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <Code>cpc</Code>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Use <Code>utm_medium</Code> to identify a medium such as email
                or cost-per-click.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Name</Typography>
              <Code>utm_campaign</Code>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Yes</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <Code>spring_sale</Code>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used for keyword analysis. Use <Code>utm_campaign</Code> to
                identify a specific product promotion or strategic campaign.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Term</Typography>
              <Code>utm_term</Code>
            </TableCell>
            <TableCell>
              <Typography variant="body1">No</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <Code>running+shoes</Code>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used for paid search. Use <Code>utm_term</Code> to note the
                keywords for this ad.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Content</Typography>
              <Code>utm_content</Code>
            </TableCell>
            <TableCell>
              <Typography variant="body1">No</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <Code>logolink</Code>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used for A/B testing and content-targeted ads. Use{" "}
                <Code>utm_content</Code> to differentiate ads or links that
                point to the same URL.
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}

export default () => {
  return (
    <Layout title="Campaign URL Builder">
      <CampaignUrlBuilder />
    </Layout>
  )
}
