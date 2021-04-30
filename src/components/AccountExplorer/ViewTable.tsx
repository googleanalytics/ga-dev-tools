import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"

import { Views } from "./useAllViews"
import { CopyIconButton } from "@/components/CopyButton"
import HighlightText from "./HighlightText"
import Spinner from "@/components/Spinner"

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
  tableCell: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyIconButton: {
    color: theme.palette.text.secondary,
  },
}))

interface ViewTableProps {
  views: Views
  className?: string
  search?: string
}

interface ViewCellProps {
  firstRow: JSX.Element | string
  secondRow?: JSX.Element | string
  copyToolTip: string
  textToCopy: string
}
const ViewCell: React.FC<ViewCellProps> = ({
  firstRow,
  secondRow,
  copyToolTip,
  textToCopy,
}) => {
  const classes = useStyles()
  return (
    <TableCell>
      <div className={classes.tableCell}>
        <div>
          <div>{firstRow}</div>
          {secondRow && <div className={classes.id}>{secondRow}</div>}
        </div>
        <CopyIconButton
          className={classes.copyIconButton}
          size="small"
          toCopy={textToCopy}
          tooltipText={copyToolTip}
        />
      </div>
    </TableCell>
  )
}

const maxCellWidth = 25
const textClamp = (text: string, maxWidth: number) => {
  if (text.length <= maxWidth) {
    return text
  } else {
    return text.substring(0, maxWidth - 3) + "..."
  }
}

// This table shows a list of populated views. A populated view is a combination
// of account, property, and view, & table ID.
const ViewsTable: React.FC<ViewTableProps> = ({ views, className, search }) => {
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
        {Array.isArray(views) ? (
          views.map(populated => {
            const { account, property, view } = populated
            const viewUrl = `https://analytics.google.com/analytics/web/#/report/vistors-overview/a${account.id}w${property.internalWebPropertyId}p${view.id}`
            return (
              <TableRow
                key={`${populated.account.name}-${populated.property.name}-${populated.view.name}`}
              >
                <ViewCell
                  textToCopy={account.id || ""}
                  copyToolTip="Copy account ID"
                  firstRow={
                    <HighlightText
                      className={classes.mark}
                      search={search}
                      text={textClamp(account.name || "", maxCellWidth)}
                    />
                  }
                  secondRow={
                    <HighlightText
                      className={classes.mark}
                      search={search}
                      text={account.id || ""}
                    />
                  }
                />
                <ViewCell
                  textToCopy={property.id || ""}
                  copyToolTip="Copy property ID"
                  firstRow={
                    <HighlightText
                      className={classes.mark}
                      search={search}
                      text={textClamp(property.name || "", maxCellWidth)}
                    />
                  }
                  secondRow={
                    <HighlightText
                      className={classes.mark}
                      search={search}
                      text={property.id || ""}
                    />
                  }
                />
                <ViewCell
                  textToCopy={view.id || ""}
                  copyToolTip="Copy view ID"
                  firstRow={
                    <a
                      className={classes.link}
                      href={viewUrl}
                      title="Open this view in Google Analytics"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <HighlightText
                        className={classes.mark}
                        search={search}
                        text={textClamp(view.name || "", maxCellWidth)}
                      />
                    </a>
                  }
                  secondRow={
                    <HighlightText
                      className={classes.mark}
                      search={search}
                      text={view.id || ""}
                    />
                  }
                />
                <ViewCell
                  textToCopy={`ga:${view.id}`}
                  copyToolTip="Copy table ID"
                  firstRow={
                    <HighlightText
                      className={classes.mark}
                      search={search}
                      text={`ga:${view.id}`}
                    />
                  }
                />
              </TableRow>
            )
          })
        ) : (
          <TableRow data-testid="components/ViewTable/no-results">
            <TableCell colSpan={4}>
              <Spinner>
                <Typography>Loading views&hellip;</Typography>
              </Spinner>
            </TableCell>
          </TableRow>
        )}
        {views.length === 0 && (
          <TableRow data-testid="components/ViewTable/no-results">
            <TableCell colSpan={4}>No results</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default ViewsTable
