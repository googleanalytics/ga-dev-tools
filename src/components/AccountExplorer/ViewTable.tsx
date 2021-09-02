import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"

import { CopyIconButton } from "@/components/CopyButton"
import HighlightText from "./HighlightText"
import Spinner from "@/components/Spinner"
import { RequestStatus } from "@/types"
import useFlattenedViews from "../ViewSelector/useFlattenedViews"
import { AccountSummary, ProfileSummary, WebPropertySummary } from "@/types/ua"

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
  flattenedViewsRequest: ReturnType<typeof useFlattenedViews>
  className?: string
  search?: string
}

interface ViewCellProps {
  firstRow: JSX.Element | string
  secondRow?: JSX.Element | string
  copyToolTip: string
  textToCopy: string
}
const APVCell: React.FC<ViewCellProps> = ({
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

const AccountCell: React.FC<{
  account: AccountSummary | undefined
  classes: ReturnType<typeof useStyles>
  search: string | undefined
}> = ({ account, classes, search }) => {
  if (account === undefined) {
    return null
  }
  return (
    <APVCell
      textToCopy={account?.id || ""}
      copyToolTip="Copy account ID"
      firstRow={
        <HighlightText
          className={classes.mark}
          search={search}
          text={textClamp(account?.name || "", maxCellWidth)}
        />
      }
      secondRow={
        <HighlightText
          className={classes.mark}
          search={search}
          text={account?.id || ""}
        />
      }
    />
  )
}

const PropertyCell: React.FC<{
  property: WebPropertySummary | undefined
  classes: ReturnType<typeof useStyles>
  search: string | undefined
}> = ({ property, classes, search }) => {
  if (property === undefined) {
    return <TableCell>No UA properties for account.</TableCell>
  }

  return (
    <APVCell
      textToCopy={property?.id || ""}
      copyToolTip="Copy property ID"
      firstRow={
        <HighlightText
          className={classes.mark}
          search={search}
          text={textClamp(property!.name!, maxCellWidth)}
        />
      }
      secondRow={
        <HighlightText
          className={classes.mark}
          search={search}
          text={property!.id!}
        />
      }
    />
  )
}

const ViewCell: React.FC<{
  account: AccountSummary | undefined
  property: WebPropertySummary | undefined
  view: ProfileSummary | undefined
  classes: ReturnType<typeof useStyles>
  search: string | undefined
}> = ({ account, property, view, classes, search }) => {
  if (view === undefined) {
    return <TableCell colSpan={2}>No UA views for account.</TableCell>
  }
  const viewUrl = `https://analytics.google.com/analytics/web/#/report/vistors-overview/a${account?.id}w${property?.internalWebPropertyId}p${view?.id}`
  return (
    <React.Fragment>
      <APVCell
        textToCopy={view!.id!}
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
              text={textClamp(view!.name!, maxCellWidth)}
            />
          </a>
        }
        secondRow={
          <HighlightText
            className={classes.mark}
            search={search}
            text={view!.id!}
          />
        }
      />
      <APVCell
        textToCopy={`ga:${view!.id!}`}
        copyToolTip="Copy table ID"
        firstRow={
          <HighlightText
            className={classes.mark}
            search={search}
            text={`ga:${view!.id!}`}
          />
        }
      />
    </React.Fragment>
  )
}

const ViewsTable: React.FC<ViewTableProps> = ({
  flattenedViewsRequest,
  className,
  search,
}) => {
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
        {flattenedViewsRequest.status === RequestStatus.Successful ? (
          flattenedViewsRequest.flattenedViews.length === 0 ? (
            <TableRow data-testid="components/ViewTable/no-results">
              <TableCell colSpan={4}>No results</TableCell>
            </TableRow>
          ) : (
            flattenedViewsRequest.flattenedViews.map(apv => {
              return (
                <TableRow
                  key={`${apv?.account?.name}-${apv?.property?.name}-${apv?.view?.name}`}
                >
                  <AccountCell
                    account={apv.account}
                    classes={classes}
                    search={search}
                  />
                  <PropertyCell
                    property={apv.property}
                    classes={classes}
                    search={search}
                  />
                  <ViewCell
                    account={apv.account}
                    property={apv.property}
                    view={apv.view}
                    classes={classes}
                    search={search}
                  />
                </TableRow>
              )
            })
          )
        ) : (
          <TableRow data-testid="components/ViewTable/no-results">
            <TableCell colSpan={4}>
              <Spinner>
                <Typography>Loading views&hellip;</Typography>
              </Spinner>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default ViewsTable
