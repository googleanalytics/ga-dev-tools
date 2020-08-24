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
import Main from "./components/main"
import ColumnGroupList from "./components/columnGroupList"
import Layout from "../../components/layout"
import { Url } from "../../constants"

const DimensionsMetricsExploror = () => {
  return (
    <Layout title="Dimensions & Metrics Explorer">
    <Typography variant="body1">
      The Dimensions & Metrics Explorer lists and describes all of the 
      dimensions and metrics available through 
      the <a href={Url.coreReporting}>Core Reporting API</a>.
    </Typography>

    <Typography variant="body1">
      The Dimensions & Metrics Explorer has the following features:
    </Typography>

    <Typography variant="body1">
      <b>Explore all of the dimensions and metrics</b> – Search or browse by 
      group. Select a dimension or metric for additional details such as 
      descriptions and attributes.
    </Typography>

    <Typography variant="body1">
      <b>Identify valid combinations</b> – Not all dimensions and metrics can be 
      queried together. Only certain dimensions and metrics can be used together
       to create valid combinations. Select a dimension or metric checkbox to 
       see all the other values that can be combined in the same query.
    </Typography>

    </Layout>
  )
}
export default DimensionsMetricsExploror
