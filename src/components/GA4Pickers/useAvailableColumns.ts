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

import { useMemo } from "react"
import { RequestStatus } from "@/types"
import {
  Dimension,
  DimensionsAndMetricsRequest,
  Metric,
} from "@/components/ga4/DimensionsMetricsExplorer/useDimensionsAndMetrics"
import { GA4Dimensions, GA4Metrics } from "."

interface Arg {
  selectedMetrics: GA4Metrics
  selectedDimensions: GA4Dimensions
  dimensionFilter?: (dimension: Dimension) => boolean
  metricFilter?: (metric: Metric) => boolean
  request: DimensionsAndMetricsRequest
}

export const useAvailableColumns = ({
  selectedMetrics,
  selectedDimensions,
  dimensionFilter,
  metricFilter,
  request,
}: Arg): {
  metricOptions: GA4Metrics
  metricOptionsLessSelected: GA4Metrics
  dimensionOptions: GA4Dimensions
  dimensionOptionsLessSelected: GA4Dimensions
} => {
  const [metrics, dimensions] = useMemo(() => {
    if (request.status !== RequestStatus.Successful) {
      return [undefined, undefined]
    }
    return [request.metrics, request.dimensions]
  }, [request])

  const selectedMetricIds = React.useMemo(
    () => new Set((selectedMetrics || []).map(dimension => dimension.apiName)),
    [selectedMetrics]
  )

  const metricOptions = React.useMemo(
    () => metrics?.filter(metricFilter || (() => true)),
    [metrics, metricFilter]
  )

  const metricOptionsLessSelected = React.useMemo(
    () =>
      metricOptions?.filter(metric => !selectedMetricIds.has(metric.apiName)),
    [metricOptions, selectedMetricIds]
  )

  const selectedDimensionIds = React.useMemo(
    () =>
      new Set((selectedDimensions || []).map(dimension => dimension.apiName)),
    [selectedDimensions]
  )

  const dimensionOptions = React.useMemo(
    () => dimensions?.filter(dimensionFilter || (() => true)),
    [dimensions, dimensionFilter]
  )

  const dimensionOptionsLessSelected = React.useMemo(
    () =>
      dimensionOptions?.filter(
        dimension => !selectedDimensionIds.has(dimension.apiName)
      ),
    [dimensionOptions, selectedDimensionIds]
  )

  return {
    metricOptions,
    metricOptionsLessSelected,
    dimensionOptions,
    dimensionOptionsLessSelected,
  }
}

export default useAvailableColumns
