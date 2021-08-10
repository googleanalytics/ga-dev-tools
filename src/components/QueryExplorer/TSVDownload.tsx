import * as React from "react"

import GetApp from "@material-ui/icons/GetApp"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles(theme => ({
  download: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
}))

interface TSVDownloadProps {
  queryResponse: gapi.client.analytics.GaData
}

const TSVDownload: React.FC<TSVDownloadProps> = ({ queryResponse }) => {
  const classes = useStyles()

  const csvContents = React.useMemo(() => {
    const baseUrl = `data:text/tsv;charset=utf8,`
    const header =
      (queryResponse.columnHeaders?.map(header => header.name).join("\t") ||
        "") + "\n"
    const rows = queryResponse.rows?.map(row => row.join("\t")).join("\n") || ""
    const encoded = encodeURI(`${baseUrl}${header}${rows}`)
    return encoded
  }, [queryResponse])

  const filename = React.useMemo(
    () =>
      `query-explorer-export-${new Date().toISOString().substring(0, 10)}.tsv`,
    []
  )

  return (
    <a className={classes.download} href={csvContents} download={filename}>
      <GetApp />
      download .tsv
    </a>
  )
}

export default TSVDownload
