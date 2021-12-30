import { CopyIconButton } from "@/components/CopyButton"
import Spinner from "@/components/Spinner"
import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core"
import { Android, Apple, Language } from "@material-ui/icons"
import React from "react"
import { AccountProperty } from "../StreamPicker/useAccountProperty"
import useAllAPS from "./useAllAPS"

interface ExploreTableProps extends AccountProperty {}

const WebCell: React.FC<{
  stream: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaWebDataStream
}> = ({ stream }) => {
  return (
    <>
      <Language />
      <Box>
        <Typography variant="body1">{stream.displayName}</Typography>
        <Typography variant="body2">
          {stream.name?.substring(stream.name?.lastIndexOf("/") + 1)}
        </Typography>
      </Box>
    </>
  )
}

const AndroidCell: React.FC<{
  stream: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAndroidAppDataStream
}> = ({ stream }) => {
  return (
    <>
      <Android />
      <Box>
        <Typography variant="body1">
          {stream.displayName || stream.packageName}
        </Typography>
        <Typography variant="body2">
          {stream.name?.substring(stream.name?.lastIndexOf("/") + 1)}
        </Typography>
      </Box>
    </>
  )
}

const IOSCell: React.FC<{
  stream: gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaIosAppDataStream
}> = ({ stream }) => {
  return (
    <>
      <Apple />
      <Box>
        <Typography variant="body1">
          {stream.displayName || stream.bundleId}
        </Typography>
        <Typography variant="body2">
          {stream.name?.substring(stream.name?.lastIndexOf("/") + 1)}
        </Typography>
      </Box>
    </>
  )
}

const useStyles = makeStyles(theme => ({
  streamCell: {
    display: "flex",
    alignItems: "center",
    "&> svg": {
      marginRight: theme.spacing(1),
    },
    "&> button": {
      marginLeft: "auto",
    },
    "&> div > p": {
      margin: "unset",
      padding: "unset",
    },
  },
}))

const ExploreTable: React.FC<ExploreTableProps> = ({ account, property }) => {
  const aps = useAllAPS()
  const classes = useStyles()

  if (aps === undefined) {
    return <Spinner ellipses>Loading accounts</Spinner>
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Account</TableCell>
          <TableCell>Property</TableCell>
          <TableCell>Stream</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {aps.map(a => (
          <React.Fragment key={a.account}>
            {a.propertySummaries.flatMap(p => {
              const Wrapper: React.FC = ({ children }) => (
                <TableRow>
                  <TableCell>
                    <Box className={classes.streamCell}>
                      <Box>
                        <Typography variant="body1">{a.displayName}</Typography>
                        <Typography variant="body2">
                          {a.name?.substring(a.name?.lastIndexOf("/") + 1)}
                        </Typography>
                      </Box>
                      <CopyIconButton
                        tooltipText="Copy account ID"
                        toCopy={
                          a.name?.substring(a.name?.lastIndexOf("/") + 1) || ""
                        }
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={classes.streamCell}>
                      <Box>
                        <Typography variant="body1">{p.displayName}</Typography>
                        <Typography variant="body2">
                          {p.property?.substring(
                            p.property?.lastIndexOf("/") + 1
                          )}
                        </Typography>
                      </Box>
                      <CopyIconButton
                        tooltipText="Copy property ID"
                        toCopy={
                          p.property?.substring(
                            p.property?.lastIndexOf("/") + 1
                          ) || ""
                        }
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={classes.streamCell}>{children}</Box>
                  </TableCell>
                </TableRow>
              )

              const rows: JSX.Element[] = []
              const baseKey = `${a.account}-${p.property}`

              if (account !== undefined) {
                if (a.account !== account.account) {
                  return null
                }
                if (property !== undefined) {
                  if (p.property !== property.property) {
                    return null
                  }
                }
              }
              if (p.webStreams === undefined) {
                rows.push(
                  <Wrapper key={`${baseKey}-web-loading`}>Loading...</Wrapper>
                )
              } else {
                p.webStreams.forEach(s =>
                  rows.push(
                    <Wrapper key={`${baseKey}-${s.name}`}>
                      <WebCell stream={s} />
                      <CopyIconButton
                        tooltipText="Copy stream ID"
                        toCopy={
                          s.name?.substring(s.name?.lastIndexOf("/") + 1) || ""
                        }
                      />
                    </Wrapper>
                  )
                )
              }

              if (p.androidStreams === undefined) {
                rows.push(
                  <Wrapper key={`${baseKey}-android-loading`}>
                    Loading...
                  </Wrapper>
                )
              } else {
                p.androidStreams.forEach(s =>
                  rows.push(
                    <Wrapper key={`${baseKey}-${s.name}`}>
                      <AndroidCell stream={s} />
                      <CopyIconButton
                        tooltipText="Copy stream ID"
                        toCopy={
                          s.name?.substring(s.name?.lastIndexOf("/") + 1) || ""
                        }
                      />
                    </Wrapper>
                  )
                )
              }

              if (p.iosStreams === undefined) {
                rows.push(
                  <Wrapper key={`${baseKey}-ios-loading`}>Loading...</Wrapper>
                )
              } else {
                p.iosStreams.forEach(s =>
                  rows.push(
                    <Wrapper key={`${baseKey}-${s.name}`}>
                      <IOSCell stream={s} />
                      <CopyIconButton
                        tooltipText="Copy stream ID"
                        toCopy={
                          s.name?.substring(s.name?.lastIndexOf("/") + 1) || ""
                        }
                      />
                    </Wrapper>
                  )
                )
              }

              return rows
            })}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}

export default ExploreTable
