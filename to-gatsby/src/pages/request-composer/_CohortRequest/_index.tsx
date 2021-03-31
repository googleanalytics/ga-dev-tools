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
import { HasView } from "../../../components/ViewSelector"
import {
  Column,
  useDimensionsAndMetrics,
  Segment,
  SamplingLevel,
} from "../_api"
import { linkFor, titleFor } from "../_HistogramRequest/_index"
import { Typography } from "@material-ui/core"
import { FancyOption } from "../../../components/FancyOption"
import { StorageKey } from "../../../constants"
import SelectSingle from "../../../components/SelectSingle"
import useCohortRequestParameters from "./_useCohortRequestParameters"
import useCohortRequest, { CohortSize } from "./_useCohortRequest"
import { useSegments } from "../../../api"
import LinkedTextField from "../../../components/LinkedTextField"
import { useEffect } from "react"
import { ReportsRequest } from "../_RequestComposer"

interface CohortRequestProps {
  view: HasView | undefined
  controlWidth: string
  setRequestObject: (request: ReportsRequest | undefined) => void
}

const CohortRequest: React.FC<CohortRequestProps> = ({
  view,
  controlWidth,
  setRequestObject,
  children,
}) => {
  const {
    viewId,
    setViewId,
    selectedMetric,
    setSelectedMetric,
    cohortSize,
    setCohortSize,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
  } = useCohortRequestParameters(view)
  // TODO - perf improvement - this should probably be passed down from the
  // parent instead of done for each one?
  const { metrics } = useDimensionsAndMetrics()
  const segments = useSegments()
  const requestObject = useCohortRequest({
    viewId,
    selectedMetric,
    cohortSize,
    selectedSegment,
    samplingLevel,
  })

  useEffect(() => {
    setRequestObject(requestObject)
  }, [requestObject, setRequestObject])

  return (
    <>
      <section className={controlWidth}>
        <LinkedTextField
          href={linkFor("ReportRequest.FIELDS.view_id")}
          linkTitle={titleFor("viewId")}
          label="viewId"
          value={viewId}
          onChange={setViewId}
          required
          helperText="The analytics view ID from which to retrieve data."
        />

        <SelectSingle<Column>
          options={metrics || []}
          getOptionLabel={column => column.id!}
          label="Cohort Metric"
          helperText="The metrics to include in the request."
          renderOption={column => (
            <FancyOption
              right={
                <Typography variant="subtitle1" color="textSecondary">
                  {column.attributes!.group}
                </Typography>
              }
            >
              <Typography variant="body1">
                {column.attributes!.uiName}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                {column.id}
              </Typography>
            </FancyOption>
          )}
          onSelectedChanged={setSelectedMetric}
          serializer={column => ({
            key: StorageKey.cohortRequestMetric,
            serialized: JSON.stringify(column),
          })}
          deserializer={(s: string) => {
            if (s === "undefined" || s === "null") {
              return undefined
            }
            return JSON.parse(s)
          }}
        />

        <SelectSingle<CohortSize>
          options={[CohortSize.Day, CohortSize.Week, CohortSize.Month]}
          getOptionLabel={cohortSize => cohortSize}
          label="Cohort Size"
          helperText="The size of the cohort to use in the request."
          renderOption={cohortSize => cohortSize}
          onSelectedChanged={cohortSize =>
            setCohortSize(cohortSize as CohortSize)
          }
          serializer={cohortSize => ({
            key: StorageKey.cohortSize,
            serialized: cohortSize === undefined ? "undefined" : cohortSize,
          })}
          deserializer={(s: string) => {
            if (s === "undefined" || s === "null") {
              return undefined
            }
            return s as CohortSize
          }}
        />

        <SelectSingle<Segment>
          options={segments || []}
          getOptionLabel={segment => segment.segmentId!}
          label="Segment"
          helperText="The segment to use for the request."
          renderOption={segment => (
            <FancyOption
              right={
                <Typography variant="subtitle1" color="textSecondary">
                  {segment.type === "CUSTOM"
                    ? "Custom Segment"
                    : "Built In Segment"}
                </Typography>
              }
            >
              <Typography variant="body1">{segment.name}</Typography>
              <Typography variant="subtitle2" color="primary">
                {segment.segmentId}
              </Typography>
            </FancyOption>
          )}
          onSelectedChanged={setSelectedSegment}
          serializer={segment => ({
            key: StorageKey.cohortRequestSegment,
            serialized: JSON.stringify(segment),
          })}
          deserializer={(s: string) => {
            if (s === "undefined") {
              return undefined
            }
            return JSON.parse(s)
          }}
        />
        <SelectSingle<SamplingLevel>
          options={Object.values(SamplingLevel)}
          getOptionLabel={samplingLevel => samplingLevel}
          label="samplingLevel"
          helperText="The desired sample size for the report."
          renderOption={samplingLevel => <>{samplingLevel}</>}
          onSelectedChanged={setSamplingLevel}
          serializer={s => ({
            key: StorageKey.cohortSamplingLevel,
            serialized: s?.toString() || "undefined",
          })}
          deserializer={s => {
            if (s === "undefined") {
              return undefined
            }
            return s as SamplingLevel
          }}
        />
        {children}
      </section>
    </>
  )
}

export default CohortRequest
