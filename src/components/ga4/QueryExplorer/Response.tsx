import React, {useState, useMemo, PropsWithChildren} from "react"

import { styled } from '@mui/material/styles';

import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

import { RequestStatus } from "@/types"
import PrettyJson from "@/components/PrettyJson"
import Spinner from "@/components/Spinner"
import { RunReportResponse, RunReportError } from "./BasicReport/useMakeRequest"

const PREFIX = 'Response';

const classes = {
  container: `${PREFIX}-container`,
  makeRequest: `${PREFIX}-makeRequest`,
  reports: `${PREFIX}-reports`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.container}`]: {
    maxHeight: 440,
  },

  [`& .${classes.makeRequest}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.reports}`]: {
    marginTop: theme.spacing(2),
  }
}));

type TabPanelProps = { value: number; index: number }
const TabPanel: React.FC<PropsWithChildren<TabPanelProps>> = ({
  value,
  index,
  children,
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

interface ReportsTableProps {
  response: RunReportResponse | undefined
  requestStatus: RequestStatus
  shouldCollapse: (props: any) => boolean
  error: RunReportError | undefined
}

const Response: React.FC<ReportsTableProps> = ({
  response,
  requestStatus,
  shouldCollapse,
  error,
}) => {

  const [tab, setTab] = useState(0)

  const loading = useMemo(
    () =>
      requestStatus === RequestStatus.InProgress ? (
        <Spinner>Loading response &hellip;</Spinner>
      ) : null,
    [requestStatus]
  )

  const errorDetail = useMemo(
    () =>
      requestStatus === RequestStatus.Failed && error !== undefined ? (
        <section>
          <Typography variant="h4">Error: {error.code}</Typography>
          <Typography>{error.message}</Typography>
        </section>
      ) : null,
    [requestStatus, error]
  )

  const pending = useMemo(
    () =>
      requestStatus === RequestStatus.NotStarted ? (
        <section>Enter all required inputs, then press make request.</section>
      ) : null,
    [requestStatus]
  )

  // TODO: Add button to save table response as a CSV & saving json response as
  // a json file.
  return (
    <section className={classes.reports}>
      <Typography variant="h3">Response</Typography>
      <Tabs
        value={tab}
        onChange={(_e, newValue) => {
          setTab(newValue as any)
        }}
      >
        <Tab label="Table" />
        <Tab label="JSON" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        {errorDetail}
        {loading}
        {pending}
        {response !== undefined && <ResponseTable response={response} />}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {errorDetail}
        {loading}
        {pending}
        <PrettyJson
          tooltipText="copy response"
          object={response}
          shouldCollapse={shouldCollapse}
        />
      </TabPanel>
    </section>
  )
}

const aggregationToColumn = (
  response: RunReportResponse,
  hasDateRange: boolean,
  key: "totals" | "minimums" | "maximums"
) => {
  const aggregations = response[key]
  if (aggregations === undefined) {
    return []
  }
  return aggregations.flatMap(row => {
    let dateRange: string | undefined = undefined
    if (hasDateRange) {
      const dimensionValues = row.dimensionValues
      if (dimensionValues !== undefined) {
        const first = dimensionValues[1]
        dateRange = first.value
      }
    }
    const metricValues = row.metricValues
    if (metricValues === undefined) {
      return []
    }
    return response.metricHeaders!.map((header, innerIdx) => {
      const aggregation = metricValues[innerIdx].value!
      return {
        metric: header.name!,
        dateRange,
        [key]: aggregation,
      }
    })
  })
}

const Aggregations: React.FC<{ response: RunReportResponse }> = ({
  response,
}) => {
  const hasDateRange = useMemo(
    () =>
      (response.totals?.length || 0) > 1 ||
      (response.minimums?.length || 0) > 1 ||
      (response.maximums?.length || 0) > 1,
    [response]
  )
  const columns = useMemo<GridColDef[]>(() => {
    const metrics = [{ field: "metric", headerName: "metric", flex: 1 }]
    const dateRange = hasDateRange
      ? [{ field: "dateRange", headerName: "dateRange", flex: 1 }]
      : []
    const totals =
      response.totals === undefined
        ? []
        : [{ field: "totals", headerName: "total", flex: 1 }]
    const mins =
      response.minimums === undefined
        ? []
        : [{ field: "minimums", headerName: "min", flex: 1 }]
    const maxs =
      response.maximums === undefined
        ? []
        : [{ field: "maximums", headerName: "max", flex: 1 }]
    const aggregations = metrics
      .concat(dateRange)
      .concat(totals)
      .concat(mins)
      .concat(maxs)
    return aggregations
  }, [hasDateRange, response])

  const rows = useMemo(() => {
    const aggregations = [
      aggregationToColumn(response, hasDateRange, "totals"),
      aggregationToColumn(response, hasDateRange, "minimums"),
      aggregationToColumn(response, hasDateRange, "maximums"),
    ]
    const longerThan1 = aggregations.filter(group => group.length > 0)
    return longerThan1
      .reduce((zipped, group) => {
        return group?.map((entry, idx) => ({ ...entry, ...zipped[idx] }))
      }, [])
      .map((a, idx) => ({ ...a, id: idx }))
  }, [response, hasDateRange])

  if (columns.length === 1) {
    return null
  }

  return (
    (<Root>
      <Typography variant="h4">Metric aggregations</Typography>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} autoPageSize />
      </div>
    </Root>)
  );
}

const ResponseTable: React.FC<{ response: RunReportResponse }> = ({
  response,
}) => {
  const columns = useMemo<GridColDef[]>(
    () =>
      (response.dimensionHeaders || [])
        .concat(response.metricHeaders || [])
        .map(a => ({
          field: a.name || "",
          headerName: a.name || "",
          flex: 1,
        })),
    [response]
  )

   const rows = useMemo(
    () =>
      (response.rows || [])
        .map(row => (row.dimensionValues || []).concat(row.metricValues || []))
        .map((row, idx) =>
          row.reduce(
            (acc: any, cell, idx) => {
              acc[columns[idx].field] = cell.value
              return acc
            },
            { id: idx }
          )
        ),
    [response, columns]
  )

  return (
    <>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} autoPageSize />
      </div>
      <Aggregations response={response} />
    </>
  )
}

export default Response
