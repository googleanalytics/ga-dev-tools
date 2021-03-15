import React from "react"
import { GetReportsResponse } from "./_api"
import {
  makeStyles,
  useTheme,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"

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

interface ReportsTableProps {
  response: GetReportsResponse | undefined
  longRequest: boolean
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  response,
  longRequest,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  // TODO - Add in functionality so this works right with cohort requests (or
  // just make a cohortRequest Table which might be clearer.)
  //
  if (longRequest) {
    return (
      <section className={classes.loadingIndicator}>
        <Loader type="Circles" color={theme.palette.primary.main} />
        <Typography>Loading...</Typography>
      </section>
    )
  }

  if (response === undefined) {
    return null
  }
  return (
    <section className={classes.reports}>
      <Typography variant="h3">Response</Typography>
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
    </section>
  )
}

export default ReportsTable
