import React, { useState, useMemo } from "react"
import { makeStyles, Typography, Tabs, Tab, Box } from "@material-ui/core"
import { DataGrid, GridColumns } from "@material-ui/data-grid"
import PrettyJson from "../../../components/PrettyJson"
import { RunReportResponse } from "./_BasicReport/_useMakeRequest"
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
}

const Response: React.FC<ReportsTableProps> = ({
  response,
  requestStatus,
  shouldCollapse,
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
        {loading}
        {pending}
        {response !== undefined && <ResponseTable response={response} />}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {loading}
        {pending}
        <PrettyJson object={response} shouldCollapse={shouldCollapse} />
      </TabPanel>
    </section>
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
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} autoPageSize />
    </div>
  )
}

export default Response
