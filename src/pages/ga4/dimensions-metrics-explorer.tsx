// Copyright 2016 Google Inc. All rights reserved.
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
import DimensionsMetricsExplorer from "@/components/ga4/DimensionsMetricsExplorer"

// TODO - ask brett if authentication is required for the "0" property. IF so,
// ask if we can relax that restriction to just apiKey.
export default ({ location: { pathname } }) => {
  return (
    <Layout
      title="Dimensions and Metrics Explorer"
      requireLogin
      pathname={pathname}
    >
      <DimensionsMetricsExplorer />
    </Layout>
  )
}
