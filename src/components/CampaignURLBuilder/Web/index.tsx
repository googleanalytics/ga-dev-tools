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
import { styled } from '@mui/material/styles';
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

import { Url, GAVersion } from "@/constants"
import GeneratedURL from "./GeneratedURL"
import useInputs from "./useInputs"
import ExternalLink from "../../ExternalLink"
import InlineCode from "../../InlineCode"

const PREFIX = 'WebURLBuilder';

const classes = {
  generatedInput: `${PREFIX}-generatedInput`,
  denseTableCell: `${PREFIX}-denseTableCell`,
  buttons: `${PREFIX}-buttons`,
  shortened: `${PREFIX}-shortened`,
  inputs: `${PREFIX}-inputs`,
  bold: `${PREFIX}-bold`,
  share: `${PREFIX}-share`,
  shareInvalid: `${PREFIX}-shareInvalid`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.generatedInput}`]: {
    wordBreak: "break-all",
  },

  [`& .${classes.denseTableCell}`]: {
    whiteSpace: "nowrap",
    "& p": {
      paddingBottom: theme.spacing(0.5),
    },
  },

  [`& .${classes.buttons}`]: {
    display: "flex",
    "& > button": {
      margin: theme.spacing(1),
    },
  },

  [`& .${classes.shortened}`]: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    "& > :first-child": {
      flexGrow: 1,
    },
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.inputs}`]: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
    maxWidth: "600px",
  },

  [`& .${classes.bold}`]: {
    fontWeight: "bold",
  },

  [`& .${classes.share}`]: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },

  [`& .${classes.shareInvalid}`]: {
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
  }
}));

const customCampaigns = (
  <ExternalLink href={Url.aboutCustomCampaigns}>Custom Campaigns</ExternalLink>
)

interface WebURLBuilderProps {
  version: GAVersion
}

export const WebURLBuilder: React.FC<WebURLBuilderProps> = ({ version }) => {


  const {
    websiteURL,
    source,
    setSource,
    medium,
    setMedium,
    campaign,
    setCampaign,
    id,
    setID,
    term,
    setTerm,
    content,
    setContent,
    onWebsiteChange,
  } = useInputs()

  return (
    (<Root>
      <Typography component={'span'} variant="body1">
        This tool allows you to easily add campaign parameters to URLs so you
        can measure {customCampaigns} in Google Analytics.
      </Typography>
      <Typography variant="h3">
        Enter the website URL and campaign information
      </Typography>
      <Typography>
        Fill out all fields marked with an asterisk (*), and the campaign URL
        will be generated for you.
      </Typography>
      <section className={classes.inputs}>
        <TextField
          id="website-url"
          required
          value={websiteURL || ""}
          onChange={onWebsiteChange}
          label="website URL"
          size="small"
          variant="outlined"
          helperText={
            <span>
              The full website URL (e.g.{" "}
              <span className={classes.bold}>https://www.example.com</span>)
            </span>
          }
        />
        <TextField
          id="campaign-id"
          value={id || ""}
          onChange={e => setID(e.target.value)}
          label="campaign ID"
          size="small"
          variant="outlined"
          helperText={<span>The ads campaign id.</span>}
        />
        <TextField
          id="campaign-source"
          required
          value={source || ""}
          onChange={e => setSource(e.target.value)}
          label="campaign source"
          size="small"
          variant="outlined"
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
          value={medium || ""}
          onChange={e => setMedium(e.target.value)}
          label="campaign medium"
          size="small"
          variant="outlined"
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
          required={version === GAVersion.UniversalAnalytics}
          value={campaign || ""}
          onChange={e => setCampaign(e.target.value)}
          label="campaign name"
          size="small"
          variant="outlined"
          helperText={
            <span>
              Product, promo code, or slogan (e.g.{" "}
              <span className={classes.bold}>spring_sale</span>) One of campaign
              name or campaign id are required.
            </span>
          }
        />
        <TextField
          id="campaign-term"
          value={term || ""}
          onChange={e => setTerm(e.target.value)}
          label="campaign term"
          size="small"
          variant="outlined"
          helperText="Identify the paid keywords"
        />
        <TextField
          id="campaign-content"
          value={content || ""}
          onChange={e => setContent(e.target.value)}
          label="campaign content"
          size="small"
          variant="outlined"
          helperText="Use to differentiate ads"
        />
      </section>
      <GeneratedURL
        version={version}
        source={source || ""}
        websiteURL={websiteURL || ""}
        medium={medium || ""}
        campaign={campaign || ""}
        id={id || ""}
        term={term || ""}
        content={content || ""}
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
              <Typography variant="body1">Campaign ID</Typography>
              <InlineCode>utm_id</InlineCode>
            </TableCell>
            <TableCell>
              <Typography variant="body1">No</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <InlineCode>abc.123</InlineCode>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used to identify which ads campaign this referral references.
                Use <InlineCode>utm_id</InlineCode> to identify a specific ads
                campaign.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Source</Typography>
              <InlineCode>utm_source</InlineCode>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Yes</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <InlineCode>google</InlineCode>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Use <InlineCode>utm_source</InlineCode> to identify a search
                engine, newsletter name, or other source.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Medium</Typography>
              <InlineCode>utm_medium</InlineCode>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Yes</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <InlineCode>cpc</InlineCode>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Use <InlineCode>utm_medium</InlineCode> to identify a medium
                such as email or cost-per-click.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Name</Typography>
              <InlineCode>utm_campaign</InlineCode>
            </TableCell>
            <TableCell>
              <Typography variant="body1">No</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <InlineCode>spring_sale</InlineCode>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used for keyword analysis. Use{" "}
                <InlineCode>utm_campaign</InlineCode> to identify a specific
                product promotion or strategic campaign.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Term</Typography>
              <InlineCode>utm_term</InlineCode>
            </TableCell>
            <TableCell>
              <Typography variant="body1">No</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <InlineCode>running+shoes</InlineCode>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used for paid search. Use <InlineCode>utm_term</InlineCode> to
                note the keywords for this ad.
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.denseTableCell}>
              <Typography variant="body1">Campaign Content</Typography>
              <InlineCode>utm_content</InlineCode>
            </TableCell>
            <TableCell>
              <Typography variant="body1">No</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <InlineCode>logolink</InlineCode>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                Used for A/B testing and content-targeted ads. Use{" "}
                <InlineCode>utm_content</InlineCode> to differentiate ads or
                links that point to the same URL.
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="h2">Related Resources</Typography>
      <Typography variant="body1" component="ul">
        <li>
          <ExternalLink href={Url.aboutCampaign}>
            About Custom Campaigns
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.bestPracticesForCreatingCustomCampaigns}>
            Best Practices for creating Custom Campaigns
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.aboutReferralTrafficReport}>
            About the Refferal Traffic report
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.aboutTrafficSourceDimensions}>
            About traffic source dimensions
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.googleAdsAutoTagging}>
            Google Ads Auto-Tagging
          </ExternalLink>
        </li>
      </Typography>
    </Root>)
  );
}

export default WebURLBuilder
