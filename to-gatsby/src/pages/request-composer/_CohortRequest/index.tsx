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
import { Column, useDimensionsAndMetrics, Segment } from "../_api"
// TODO - ReportTable should be a general component for this Demo.
import {
  linkFor,
  titleFor,
  ReportTable,
  SamplingLevel,
} from "../_HistogramRequest"
import ExternalLink from "../../../components/ExternalLink"
import {
  TextField,
  Typography,
  Button,
  makeStyles,
  useTheme,
} from "@material-ui/core"
import { FancyOption } from "../../../components/FancyOption"
import { StorageKey } from "../../../constants"
import SelectSingle from "../../../components/SelectSingle"
import useCohortRequestParameters from "./_useCohortRequestParameters"
import useCohortRequest, { CohortSize } from "./_useCohortRequest"
import Loader from "react-loader-spinner"
import useMakeCohortRequest from "./_useMakeCohortRequest"
import { useSegments } from "../../../api"

interface CohortRequestProps {
  view: HasView | undefined
  controlWidth: string
}

const useStyles = makeStyles(theme => ({
  // TODO - The loading indictor should be abstracted away for general use.
  loadingIndicator: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

const CohortRequest: React.FC<CohortRequestProps> = ({
  view,
  controlWidth,
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
  const classes = useStyles()
  const theme = useTheme()
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
  const { response, longRequest, makeRequest } = useMakeCohortRequest(
    requestObject
  )

  return (
    <>
      <section className={controlWidth}>
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

        <Button
          variant="contained"
          color="primary"
          onClick={makeRequest}
          className={classes.makeRequest}
        >
          Make Request
        </Button>
      </section>

      {longRequest && (
        <section className={classes.loadingIndicator}>
          <Loader type="Circles" color={theme.palette.primary.main} />
          <Typography>Loading...</Typography>
        </section>
      )}
      <ReportTable response={response} />
    </>
  )
}

export default CohortRequest