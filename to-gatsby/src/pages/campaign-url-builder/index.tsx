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
import Button from "@material-ui/core/Button"
import FileCopy from "@material-ui/icons/FileCopy"
import Error from "@material-ui/icons/ErrorOutline"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { useLocalStorage } from "react-use"
import classnames from "classnames"

import { Url, StorageKey } from "../../constants"
import Layout from "../../components/layout"

const Code: React.FC = ({ children }) => {
  const classes = useStyles()
  return (
    <Typography className={classes.code} variant="body2" component="span">
      {children}
    </Typography>
  )
}

const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(3),
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(1),
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

  React.useEffect(() => {
    if (!hasAllRequired) {
      setGeneratedUrl("")
      return
    }
    const params = new URLSearchParams()
    source !== "" && params.set("utm_source", source)
    medium !== "" && params.set("utm_medium", medium)
    campaign !== "" && params.set("utm_campaign", campaign)
    term !== "" && params.set("utm_term", term)
    content !== "" && params.set("utm_content", content)

    const asString = `?${params.toString()}`
    const newUrl = `${websiteUrl}${asString}`
    setGeneratedUrl(newUrl)
  }, [hasAllRequired, websiteUrl, source, medium, campaign, term, content])

  return (
    <Paper
      className={classnames(classes.share, {
        [classes.shareInvalid]: !hasAllRequired,
      })}
    >
      {hasAllRequired ? (
        <>
          <Typography variant="h2">Share the generated campaign URL</Typography>

          <Typography variant="body1">
            Use this URL in any promotional channels you want to be associated
            with this custom campaign.
          </Typography>
          <TextField multiline value={generatedUrl} variant="outlined" />
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography variant="body2" component="span">
                Set campaign parameters in the fragment protion of the URL (not
                recommended)
              </Typography>
            }
          />
          <section className={classes.buttons}>
            <Button variant="outlined" color="primary" startIcon={<FileCopy />}>
              Copy URL
            </Button>
            <Button variant="outlined" startIcon={<FileCopy />}>
              Convert URL to Short Link
            </Button>
          </section>
        </>
      ) : (
        <>
          <Error />
          <Typography variant="body1">
            Fill out all the required fields above and a URL will be
            automatically generated for you here.
          </Typography>
        </>
      )}
    </Paper>
  )
}

export const CampaignUrlBuilder = () => {
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
          required
          value={websiteUrl}
          onChange={e => setWebsiteUrl(e.target.value)}
          label="Website URL"
          helperText={
            <span>
              The full website URL (e.g.{" "}
              <span className={classes.bold}>https://www.example.com</span>)
            </span>
          }
        />
        <TextField
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
          value={term}
          onChange={e => setTerm(e.target.value)}
          label="Campaign Term"
          helperText="Identify the paid keywords"
        />
        <TextField
          value={content}
          onChange={e => setContent(e.target.value)}
          label="Campaign Content"
          helperText="Use to differentiate ads"
        />
        <Typography variant="body2" color="error">
          All fields marked with an asterisk (*) are required.
        </Typography>
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
