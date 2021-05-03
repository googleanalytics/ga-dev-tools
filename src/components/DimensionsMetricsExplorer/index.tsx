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
import Explorer from "./Explorer"

export const DimensionsMetricsExplorer = () => {
  return (
    <>
      <Typography variant="body1">
        The Dimensions & Metrics Explorer lists and describes all of the
        dimensions and metrics available through the Core Reporting API.
      </Typography>

      <Typography variant="body1">
        The Dimensions & Metrics Explorer has the following features:
      </Typography>

      <Typography variant="body1">
        <strong>Explore all of the dimensions and metrics</strong> – Search or
        browse by group. Select a dimension or metric for additional details
        such as descriptions and attributes.
      </Typography>

      <Typography variant="body1">
        <strong>Identify valid combinations</strong> – Not all dimensions and
        metrics can be queried together. Only certain dimensions and metrics can
        be used together to create valid combinations. Select a dimension or
        metric checkbox to see all the other values that can be combined in the
        same query.
      </Typography>

      <Explorer />
    </>
  )
}

export default DimensionsMetricsExplorer
