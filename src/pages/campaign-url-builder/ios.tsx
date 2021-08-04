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

import Layout from "@/components/Layout"
import CampaignURLBuilder, {
  URLBuilderType,
} from "@/components/CampaignURLBuilder"
import { GAVersion } from "@/constants"
import { IS_SSR } from "@/hooks"

export default ({ location: { pathname } }) => {
  return (
    <Layout
      title="iOS Campaign URL Builder"
      pathname={pathname}
      description="This tool allows you to easily add campaign parameters to iOS URLs so you can measure Custom Campaigns in Google Analytics."
    >
      {IS_SSR ? null : (
        <CampaignURLBuilder
          version={GAVersion.UniversalAnalytics}
          type={URLBuilderType.Ios}
        />
      )}
    </Layout>
  )
}
