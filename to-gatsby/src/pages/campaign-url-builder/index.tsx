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
import { FileCopy } from "@material-ui/icons"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"

import { Url } from "../../constants"
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
}))

const customCampaigns = <a href={Url.customCampaigns}>Custom Campaigns</a>

export const CampaignUrlBuilder = () => {
  const classes = useStyles()
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
          label="Website URL"
          helperText={
            <span>
              The full website URL (e.g.{" "}
              <span className={classes.bold}>https://www.example.com</span>)
            </span>
          }
        />
        <TextField
          label="Campaign Source"
          helperText={
            <span>
              The referrer (e.g. <span className={classes.bold}>google</span>,{" "}
              <span className={classes.bold}>newsletter</span>)
            </span>
          }
        />
        <TextField
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
          label="Campaign Name"
          helperText={
            <span>
              Product, promo code, or slogan (e.g.{" "}
              <span className={classes.bold}>spring_sale</span>)
            </span>
          }
        />
        <TextField
          label="Campaign Term"
          helperText="Identify the paid keywords"
        />
        <TextField
          label="Campaign Content"
          helperText="Use to differentiate ads"
        />
      </section>
      <Paper className={classes.share}>
        <Typography variant="h2">Share the generated campaign URL</Typography>

        <Typography variant="body1">
          Use this URL in any promotional channels you want to be associated
          with this custom campaign.
        </Typography>
        <TextField value={"placeholdervalue.com/hello"} variant="outlined" />
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
      </Paper>

      <Typography variant="h2">
        More information and examples for each parameter
      </Typography>
      <Typography variant="body1">
        The following table gives a detailed explanation and example of each of
        the campaign parameters.
      </Typography>

      <Table>
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
                <Code>utm_campaign=spring_sale</Code>
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
