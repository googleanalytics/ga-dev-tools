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
import { useState, useMemo } from "react"
import { HasView } from "../../components/ViewSelector"
import { Column, Segment, useDimensionsAndMetrics } from "./_api"
import { SamplingLevel, linkFor, titleFor } from "./_HistogramRequest"
import ExternalLink from "../../components/ExternalLink"
import { TextField, Typography } from "@material-ui/core"
import { FancyOption } from "../../components/FancyOption"
import { StorageKey } from "../../constants"
import SelectSingle from "../../components/SelectSingle"

const useCohortRequestParameters = (view: HasView | undefined) => {
  const [viewId, setViewId] = useState("")
  const [selectedMetric, setSelectedMetric] = useState<Column>()
  const [samplingLevel, setSamplingLevel] = useState<SamplingLevel>()
  const [selectedSegment, setSelectedSegment] = useState<Segment>()

  useMemo(() => {
    const id = view?.view.id
    if (id !== undefined) {
      setViewId(id)
    }
  }, [view])

  return {
    viewId,
    setViewId,
    selectedMetric,
    setSelectedMetric,
    selectedSegment,
    setSelectedSegment,
    samplingLevel,
    setSamplingLevel,
  }
}

interface CohortRequestProps {
  view: HasView | undefined
}

const CohortRequest: React.FC<CohortRequestProps> = ({ view }) => {
  const { viewId, setViewId, setSelectedMetric } = useCohortRequestParameters(
    view
  )
  // TODO - perf improvement - this should probably be passed down from the
  // parent instead of done for each one?
  const { metrics } = useDimensionsAndMetrics()
  return (
    <>
      <TextField
        InputProps={{
          endAdornment: (
            <ExternalLink
              href={linkFor("ReportRequest.FIELDS.view_id")}
              title={titleFor("viewId")}
            />
          ),
        }}
        size="small"
        variant="outlined"
        fullWidth
        label="viewId"
        value={viewId}
        onChange={e => setViewId(e.target.value)}
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
            <Typography variant="body1">{column.attributes!.uiName}</Typography>
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
          if (s === "undefined") {
            return undefined
          }
          return JSON.parse(s)
        }}
      />
    </>
  )
}

export default CohortRequest
