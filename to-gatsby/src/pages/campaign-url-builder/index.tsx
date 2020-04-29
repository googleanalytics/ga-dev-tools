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
  infoTable: {
    "& tbody": {
      "& tr": {
        "& td": {
          "& p": {
            paddingBottom: "unset",
          },
        },
      },
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

      <table className={classes.infoTable}>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Required</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Typography variant="body1">Campaign Source</Typography>
              <Code>utm_source</Code>
            </td>
            <td>
              <Typography variant="body1">Yes</Typography>
            </td>
            <td>
              <Typography variant="body1">
                Use <Code>utm_source</Code> to identify a search engine,
                newsletter name, or other source.
              </Typography>
            </td>
            <td>
              <Code>google</Code>
            </td>
          </tr>
        </tbody>
      </table>
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
