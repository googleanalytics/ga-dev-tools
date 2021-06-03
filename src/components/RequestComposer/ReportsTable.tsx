import React, { useState } from "react"

import Typography from "@material-ui/core/Typography"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Box from "@material-ui/core/Box"
import makeStyles from "@material-ui/core/styles/makeStyles"

import PrettyJson, { shouldCollapseResponse } from "@/components/PrettyJson"
import { GetReportsResponse } from "./api"
import Spinner from "@/components/Spinner"

const useStyles = makeStyles(theme => ({
  loadingIndicator: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
  response: GetReportsResponse | undefined
  longRequest: boolean
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  response,
  longRequest,
}) => {
  const classes = useStyles()
  const [tab, setTab] = useState(0)
  // TODO - Add in functionality so this works right with cohort requests (or
  // just make a cohortRequest Table which might be clearer.)
  //
  if (longRequest) {
    return <Spinner ellipses>Loading</Spinner>
  }

  if (response === undefined) {
    return null
  }
  return (
    <section className={classes.reports}>
      <Typography variant="h3">Response</Typography>
      <Tabs
        value={tab}
        onChange={(_e, newValue) => {
          // TODO - huh?
          setTab(newValue as any)
        }}
      >
        <Tab label="Table" />
        <Tab label="JSON" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        {response.reports?.map((reportData, reportIdx) => {
          return (
            <TableContainer key={reportIdx} className={classes.container}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {reportData.columnHeader?.dimensions?.map(header => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                    {reportData.columnHeader?.metricHeader?.metricHeaderEntries?.map(
                      header => (
                        <TableCell key={header.name}>{header.name}</TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.data?.rows?.map((row, idx) => (
                    <TableRow key={`row-${idx}`}>
                      {row.dimensions?.map((column, innerIdx) => (
                        <TableCell key={`row-${idx} column-${innerIdx}`}>
                          {column}
                        </TableCell>
                      ))}
                      {row?.metrics?.flatMap(({ values: dateRange }) =>
                        dateRange?.map((column, innerIdx) => (
                          <TableCell key={`row-${idx} column-${innerIdx}`}>
                            {column}
                          </TableCell>
                        ))
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        })}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <PrettyJson
          tooltipText="copy response"
          object={response}
          shouldCollapse={shouldCollapseResponse}
        />
      </TabPanel>
    </section>
  )
}

export default ReportsTable
