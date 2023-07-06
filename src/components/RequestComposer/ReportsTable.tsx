import React, {PropsWithChildren, useState} from "react"

import { styled } from '@mui/material/styles';

import Typography from "@mui/material/Typography"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"

import PrettyJson, { shouldCollapseResponse } from "@/components/PrettyJson"
import { GetReportsResponse } from "./api"
import Spinner from "@/components/Spinner"

const PREFIX = 'ReportsTable';

const classes = {
  loadingIndicator: `${PREFIX}-loadingIndicator`,
  container: `${PREFIX}-container`,
  makeRequest: `${PREFIX}-makeRequest`,
  reports: `${PREFIX}-reports`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`& .${classes.loadingIndicator}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  [`& .${classes.container}`]: {
    maxHeight: 440,
  },

  [`& .${classes.makeRequest}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },

  [`&.${classes.reports}`]: {
    marginTop: theme.spacing(2),
  }
}));

type Props = { value: number,
  index: number }

const TabPanel: React.FC<PropsWithChildren<Props>> = ({
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
    <Root className={classes.reports}>
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
    </Root>
  );
}

export default ReportsTable
