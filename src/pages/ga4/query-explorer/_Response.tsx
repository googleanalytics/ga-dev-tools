import React, { useState, useMemo } from "react"
import { makeStyles, Typography, Tabs, Tab, Box } from "@material-ui/core"
import { DataGrid, GridColumns } from "@material-ui/data-grid"
import PrettyJson from "../../../components/PrettyJson"
import {
  RunReportResponse,
  RunReportError,
} from "./_BasicReport/_useMakeRequest"
import { RequestStatus } from "../../../types"
import Spinner from "../../../components/Spinner"

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: 440,
  },
  makeRequest: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  reports: {
    marginTop: theme.spacing(2),
  },
}))

const TabPanel: React.FC<{ value: number; index: number }> = ({
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
  const classes = useStyles()
  const [tab, setTab] = useState(0)

  const loading = useMemo(
    () =>
      requestStatus === RequestStatus.Pending ? (
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
        <PrettyJson object={response} shouldCollapse={shouldCollapse} />
      </TabPanel>
    </section>
  )
}

const toColumn = (type: string) => (row: gapi.client.analyticsdata.Row) => {
  const dateRangeName = row?.dimensionValues[1]?.value || ""
  const name = `${dateRangeName} ${type}`
  return {
    field: name,
    headerName: name,
    flex: 1,
  }
}

const Aggregations: React.FC<{ response: RunReportResponse }> = ({
  response,
}) => {
  const hasDateRange = useMemo(
    () =>
      response.totals?.length > 1 ||
      response.minimums?.length > 1 ||
      response.maximums?.length > 1,
    [response]
  )
  const columns = useMemo(() => {
    const metrics = [{ field: "metric", headerName: "metric", flex: 1 }]
    const dateRange = hasDateRange
      ? [{ field: "dateRange", headerName: "dateRange", flex: 1 }]
      : []
    const totals =
      response.totals === undefined
        ? []
        : [{ field: "total", headerName: "total", flex: 1 }]
    const mins =
      response.minimums === undefined
        ? []
        : [{ field: "min", headerName: "min", flex: 1 }]
    const maxs =
      response.maximums === undefined
        ? []
        : [{ field: "max", headerName: "max", flex: 1 }]
    const aggregations = metrics
      .concat(dateRange)
      .concat(totals)
      .concat(mins)
      .concat(maxs)
    return aggregations
  }, [hasDateRange])

  const rows = useMemo(() => {
    const mins = response.minimums?.flatMap((row, idx) => {
      const dateRange = hasDateRange ? row.dimensionValues[1].value : undefined
      return response.metricHeaders?.map((header, innerIdx) => {
        const min = row.metricValues[innerIdx].value
        return {
          metric: header.name,
          dateRange,
          min,
        }
      })
    })
    const maxs = response.maximums?.flatMap((row, idx) => {
      const dateRange = hasDateRange ? row.dimensionValues[1].value : undefined
      return response.metricHeaders?.map((header, innerIdx) => {
        const max = row.metricValues[innerIdx].value
        return {
          metric: header.name,
          dateRange,
          max,
        }
      })
    })
    const totals = response.totals?.flatMap((row, idx) => {
      const dateRange = hasDateRange ? row.dimensionValues[1].value : undefined
      return response.metricHeaders?.map((header, innerIdx) => {
        const total = row.metricValues[innerIdx].value
        return {
          metric: header.name,
          dateRange,
          total,
        }
      })
    })
    const longerThan1 = [mins, totals, maxs].filter(group => group?.length > 0)
    return longerThan1
      .reduce((zipped, group) => {
        return group.map((entry, idx) => ({ ...entry, ...zipped[idx] }))
      }, [])
      .map((a, idx) => ({ ...a, id: idx }))
  }, [response, hasDateRange])
  console.log(rows)

  if (columns.length === 1) {
    return null
  }

  return (
    <>
      <Typography variant="h4">Metric aggregations</Typography>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} autoPageSize />
      </div>
    </>
  )
}

const ResponseTable: React.FC<{ response: RunReportResponse }> = ({
  response,
}) => {
  const columns = useMemo<GridColumns>(
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
            (acc, cell, idx) => {
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
