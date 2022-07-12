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

import { navigate } from "gatsby"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"

import { GAVersion } from "@/constants"
import TabPanel from "@/components/TabPanel"
import WebURLBuilder from "./Web"
import PlayURLBuilder from "./Play"
import IOSURLBuilder from "./IOS"

export enum URLBuilderType {
  Web = "web",
  Play = "play",
  Ios = "ios",
}

interface CampaignURLBuilderProps {
  version: GAVersion
  type: URLBuilderType
}

export const CampaignURLBuilder: React.FC<CampaignURLBuilderProps> = ({
  version,
  type,
}) => {
  const tab = React.useMemo(() => {
    switch (type) {
      case URLBuilderType.Web:
        return 0
      case URLBuilderType.Play:
        return 1
      default:
        return 0
    }
  }, [type])

  const pathForIdx = React.useCallback((idx: number) => {
    switch (idx) {
      case 0:
        return `/campaign-url-builder/`
      case 1:
        return `/campaign-url-builder/play/`
      default:
        throw new Error("No matching idx")
    }
  }, [])

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_e, newValue) => {
          const path = `${
            version === GAVersion.GoogleAnalytics4 ? "/ga4" : ""
          }${pathForIdx(newValue)}`
          navigate(path)
        }}
      >
        <Tab label="Web" />
        <Tab label="Play" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <WebURLBuilder version={version} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <PlayURLBuilder version={version} />
      </TabPanel>
    </>
  )
}

export default CampaignURLBuilder
