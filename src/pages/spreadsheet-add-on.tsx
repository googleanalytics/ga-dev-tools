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
import { StaticImage } from "gatsby-plugin-image"

import { Url } from "@/constants"
import Layout from "@/components/Layout"
import ExternalLink from "@/components/ExternalLink"

const SpreadsheetAddOn = ({ location: { pathname } }) => {
  return (
    <Layout
      title="Spreadsheet Add-on"
      pathname={pathname}
      description="The Google Analytics Spreadsheet Add-on makes it easier for Google Analytics users to access, visualize, share, and manipulate their data in Google Spreadsheets."
    >
      <Typography variant="h2">Overview</Typography>

      <Typography variant="body1">
        The{" "}
        <ExternalLink href={Url.spreadsheetAddOn}>
          Google Analytics Spreadsheet Add-on
        </ExternalLink>{" "}
        makes it easier for Google Analytics users to access, visualize, share,
        and manipulate their data in Google Spreadsheets. The add-on gives you
        the full power of the Google Analytics{" "}
        <ExternalLink href={Url.reportingApis}>
          Core and Multi-Channel Funnels Reporting APIs
        </ExternalLink>{" "}
        without requiring you to know or write any code.
      </Typography>

      <a href={Url.spreadsheetAddOnExternal}>
        <StaticImage
          alt="screenshot of the add-on"
          src="../images/screenshots/spreadsheet-add-on-2x.png"
        />
      </a>

      <Typography variant="caption" paragraph>
        A Google Analytics Spreadsheet Add-on report
      </Typography>

      <Typography variant="body1">With this tool, you can:</Typography>

      <Typography variant="body1" component="ul">
        <li>Query data from multiple views.</li>
        <li>Create custom calculations from your report data.</li>
        <li>
          Create visualizations with the built-in visualization tools, and embed
          those visualizations on third-party websites.
        </li>
        <li>Schedule your reports to run and update automatically.</li>
        <li>
          Easily control who can see your data and visualizations by leveraging
          Google Spreadsheet's existing sharing and privacy features.
        </li>
      </Typography>

      <Typography variant="h2">Learn More</Typography>

      <Typography variant="body1">
        To start using the Google Analytics Spreadsheet add-on you can simply
        download it from the{" "}
        <ExternalLink href={Url.spreadsheetAddOnExternal}>
          Chrome Web Store
        </ExternalLink>{" "}
        and try adding it to one of your spreadsheets today.
      </Typography>

      <Typography variant="body1">
        If you have questions, check out the{" "}
        <ExternalLink href={Url.spreadsheetAddOn}>solution guide</ExternalLink>{" "}
        which explains how to install and use the add-on and goes over each
        option in detail.
      </Typography>
    </Layout>
  )
}
export default SpreadsheetAddOn
