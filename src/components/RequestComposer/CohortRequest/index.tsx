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
import { useEffect } from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"

import { usePersistentBoolean } from "@/hooks"
import { StorageKey } from "@/constants"
import { HasView } from "@/components/ViewSelector"
import {
  MetricPicker,
  SegmentPicker,
  V4SamplingLevelPicker,
  CohortSizePicker,
  UAMetric,
} from "@/components/UAPickers"
import LinkedTextField from "@/components/LinkedTextField"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { linkFor, titleFor } from "../HistogramRequest"
import useCohortRequestParameters from "./useCohortRequestParameters"
import useCohortRequest from "./useCohortRequest"
import { ReportsRequest } from "../RequestComposer"

interface CohortRequestProps {
  view: HasView | undefined
  controlWidth: string
  setRequestObject: (request: ReportsRequest | undefined) => void
}

const useStyles = makeStyles(theme => ({
  showSegments: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const CohortRequest: React.FC<CohortRequestProps> = ({
  view,
  controlWidth,
  setRequestObject,
  children,
}) => {
  const classes = useStyles()
  const [
    showSegmentDefinition,
    setShowSegmentDefinition,
  ] = usePersistentBoolean(StorageKey.cohortRequestShowSegmentDefinition, false)
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

  const cohortFilter = React.useCallback(
    (metric: NonNullable<UAMetric>): boolean =>
      metric?.attributes?.group === "Lifetime Value and Cohorts",
    []
  )

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
        <MetricPicker
          view={view}
          setMetric={setSelectedMetric}
          storageKey={StorageKey.cohortRequestMetric}
          helperText="The metrics to include in the request."
          filter={cohortFilter}
        />
        <CohortSizePicker
          setCohortSize={setCohortSize}
          storageKey={StorageKey.cohortRequestCohortSize}
          helperText="The size of the cohort to use in the request."
        />
        <SegmentPicker
          setSegment={setSelectedSegment}
          storageKey={StorageKey.cohortRequestSegment}
          showSegmentDefinition={showSegmentDefinition}
        />
        <LabeledCheckbox
          className={classes.showSegments}
          checked={showSegmentDefinition}
          setChecked={setShowSegmentDefinition}
        >
          Show segment definitions instead of IDs.
        </LabeledCheckbox>
        <V4SamplingLevelPicker
          setSamplingLevel={setSamplingLevel}
          storageKey={StorageKey.cohortRequestSamplingLevel}
        />
        {children}
      </section>
    </>
  )
}

export default CohortRequest
