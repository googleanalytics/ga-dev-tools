import React, { useState, useMemo } from "react"
import {
  makeStyles,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core"
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
        {response !== undefined && <ResponseTable response={response} />}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {loading}
        <PrettyJson object={response} shouldCollapse={shouldCollapse} />
      </TabPanel>
    </section>
  )
}

const ResponseTable: React.FC<{ response: RunReportResponse }> = ({
  response,
}) => {
  const classes = useStyles()
  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {response.dimensionHeaders?.map(header => (
              <TableCell key={header.name}>{header.name}</TableCell>
            ))}
            {response.metricHeaders?.map(header => (
              <TableCell key={header.name}>{header.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {response.rows?.map((row, idx) => (
            <TableRow key={`row-${idx}`}>
              {row.dimensionValues?.map((dim, innerIdx) => (
                <TableCell key={`row-${idx} column-${innerIdx}`}>
                  {dim.value}
                </TableCell>
              ))}
              {row.metricValues?.map((dim, innerIdx) => (
                <TableCell key={`row-${idx} column-${innerIdx}`}>
                  {dim.value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Response
