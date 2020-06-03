import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useThrottle } from "react-use"
import CallMadeIcon from "@material-ui/icons/CallMade"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"

import { HasView } from "../../components/ViewSelector"
import HighlightText from "./_HighlightText"

const useStyles = makeStyles(theme => ({
  id: {
    color: theme.palette.text.secondary,
  },
  mark: {
    backgroundColor: theme.palette.success.light,
  },
  link: {
    color: theme.palette.info.main,
  },
}))

interface ViewTableProps {
  views: HasView[]
  className?: string
  search?: string
}

// This table shows a list of populated views. A populated view is a combination
// of account, property, and view, & table ID.
const ViewsTable: React.FC<ViewTableProps> = ({ views, className, search }) => {
  const throttledSearch = useThrottle(search, 100)
  const classes = useStyles()
  return (
    <Table
      size="small"
      data-testid="components/ViewTable"
      className={className}
    >
      <TableHead>
        <TableRow>
          <TableCell>Account</TableCell>
          <TableCell>Property</TableCell>
          <TableCell>View</TableCell>
          <TableCell>Table ID</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {views.length === 0 && (
          <TableRow data-testid="components/ViewTable/no-results">
            <TableCell colSpan={4}>No results</TableCell>
          </TableRow>
        )}
        {views.map(populated => {
          const { account, property, view } = populated
          const viewUrl = `https://analytics.google.com/analytics/web/#/report/vistors-overview/a${account.id}w${property.internalWebPropertyId}p${view.id}`
          return (
            <TableRow
              key={`${populated.account.name}-${populated.property.name}-${populated.view.name}`}
            >
              <TableCell>
                <div>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={account.name || ""}
                  />
                </div>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={account.id || ""}
                  ></HighlightText>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={property.name || ""}
                  />
                </div>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={property.id || ""}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <a
                    className={classes.link}
                    href={viewUrl}
                    title="Open this view in Google Analytics"
                    target="_blank"
                  >
                    <HighlightText
                      className={classes.mark}
                      search={throttledSearch}
                      text={view.name || ""}
                    />
                    <CallMadeIcon />
                  </a>
                </div>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={view.id || ""}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={`ga:${view.id}`}
                  />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default ViewsTable
