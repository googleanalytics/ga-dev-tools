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

import { Url } from "@/constants"
import Layout from "@/components/Layout"
import ExternalLink from "@/components/ExternalLink"

const TagAssistant = ({ location: { pathname } }) => {
  return (
    <Layout
      title="Tag Assistant"
      pathname={pathname}
      description="Google Tag Assistant is a Chrome Extension that helps you validate the measurement code on your website and troubleshoot common problems."
    >
      <Typography variant="body1">
        Google{" "}
        <ExternalLink href={Url.tagAssistantExternal}>
          Tag Assistant
        </ExternalLink>{" "}
        is a Chrome Extension that helps you validate the measurement code on
        your website and troubleshoot common problems. It's an ideal tool for
        debugging and testing your analytics.js implementations locally and
        ensuring everything is correct before deploying your code to production.
      </Typography>

      <Typography variant="body1">
        Tag Assistant works by letting you record a typical user flow. It keeps
        track of all the hits you send, checks them for any problems, and gives
        you a full report of the interactions. If it detects any issues or
        potential improvements, it will let you know.
      </Typography>

      <Typography variant="body1">
        To see how Tag Assistant works, check out the video below. In it Philip
        Walton, Developer Programs Engineer on the Google Analytics team,
        demonstrates how you can use Tag Assistant to catch errors and check the
        validity of advanced measurement implementations such as{" "}
        <ExternalLink href={Url.crossDomainMeasurement}>
          cross-domain measurement
        </ExternalLink>
        .
      </Typography>

      <iframe
        title="Validating your Google Analytics Implementations with Google Tag Assistant"
        width="640"
        height="400"
        src="https://www.youtube.com/embed/O_FFUw1tSfI"
        frameBorder="0"
        allowFullScreen
      ></iframe>

      <Typography variant="caption" paragraph>
        Using Tag Assistant to validate your measurement implementations.
      </Typography>

      <Typography variant="h3">Links mentioned in the video</Typography>

      <Typography variant="body1" component="ul">
        <li>
          <ExternalLink href={Url.protocolParameters}>
            Measurement Protocol parameter reference
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.crossDomainMeasurement}>
            Cross-domain Linker plugin
          </ExternalLink>
        </li>
      </Typography>

      <Typography variant="h2">Learn More</Typography>

      <Typography variant="body1">
        To learn more about Tag Assistant and using Tag Assistant Recordings,
        you can read about them in the Google Analytics Help Center:
      </Typography>

      <Typography variant="body1" component="ul">
        <li>
          <ExternalLink href={Url.aboutTagAssistant}>
            About Tag Assistant
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={Url.aboutTagAssistantRecordings}>
            About Tag Assistant Recordings
          </ExternalLink>
        </li>
      </Typography>
    </Layout>
  )
}
export default TagAssistant
