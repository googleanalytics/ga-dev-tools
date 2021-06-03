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
import { makeStyles } from "@material-ui/core/styles"
import { StaticImage } from "gatsby-plugin-image"

import { Url } from "@/constants"
import ExternalLink from "@/components/ExternalLink"

const useStyles = makeStyles({ partnersImage: { maxWidth: "600px" } })

const IndexPage: React.FC = () => {
  const classes = useStyles()
  return (
    <>
      <StaticImage
        className={classes.partnersImage}
        alt="GA partners logo"
        src="../../images/google-analytics-partners-2x.png"
      />
      <Typography variant="h2" id="about">
        About This Site
      </Typography>
      <Typography variant="body1">
        <b>Google Analytics Demos & Tools</b> is a resource for users and
        developers to discover what's possible with the Google Analytics
        Platform. Learn how to implement GA and applications that can be built
        to take advantage of the flexibility and power of Google Analytics.
      </Typography>
      <Typography variant="body1">
        The code for this entire site is open source and{" "}
        <ExternalLink href={Url.gaDevToolsGitHub}>
          available on GitHub
        </ExternalLink>
        . We encourage you to take a look if you'd like to see how anything is
        done.
      </Typography>
      <Typography variant="h3">Support for UA & GA4</Typography>
      <Typography variant="body1">
        There is support for both Universal Analytics (UA) and Google Analytics
        4 (GA4). Click the toggle in the nav bar to switch between the UA and
        GA4 versions of the site.
      </Typography>
      <Typography variant="h3">Demos</Typography>
      <Typography variant="body1">
        Live demos to help you learn about Google Analytics features.
      </Typography>
      <Typography variant="body1" component="ul">
        <li>Working demos with actual data sent to Google Analytics.</li>
        <li> Use these demos as a reference for your own implementation.</li>
        <li>Interactive elements that provide implementation code snippets.</li>
      </Typography>
      <Typography variant="h3">Tools</Typography>
      <Typography variant="body1">
        Tools to showcase how Google Analytics can be extendend with custom
        solutions.
      </Typography>
      <Typography variant="body1" component="ul">
        <li>Tools are targeted at real-world use cases and solutions.</li>
        <li>
          Access advanced Google Analytics features without writing any code.
        </li>
        <li>
          All publicly available technologies are used. Nothing proprietary.
        </li>
      </Typography>
      <Typography variant="h2" id="help">
        Help &amp; Feedback
      </Typography>
      <Typography variant="h3">For this site</Typography>
      <Typography variant="body1" component="ul">
        <li>
          You may report bugs by{" "}
          <ExternalLink href={Url.gaDevToolsGitHubNewIssue}>
            submitting an issue
          </ExternalLink>{" "}
          on GitHub.
        </li>
        <li>
          You may also use GitHub to{" "}
          <ExternalLink href={Url.gaDevToolsGitHubNewIssue}>
            request a new demo or tool
          </ExternalLink>
          .
        </li>
      </Typography>
      <Typography variant="h3">For the Google Analytics platform</Typography>
      <Typography component="ul" variant="body1">
        <li>
          Documentation for all Google Analytics API, libraries and SDKs can be
          found on{" "}
          <ExternalLink href={Url.gaDevsite}>
            Google Analytics Developers
          </ExternalLink>
          .
        </li>
        <li>
          If you have questions, please refer to the{" "}
          <ExternalLink href={Url.gaDevsiteHelp}>getting help</ExternalLink>{" "}
          section of the developers site to find the best place to get your
          questions answered.
        </li>
      </Typography>
    </>
  )
}

export default IndexPage
