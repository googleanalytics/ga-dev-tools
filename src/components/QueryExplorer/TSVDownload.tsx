import * as React from "react"

import { styled } from '@mui/material/styles';

import GetApp from "@mui/icons-material/GetApp"

const PREFIX = 'TSVDownload';

const classes = {
  download: `${PREFIX}-download`
};

const Root = styled('a')((
  {
    theme
  }
) => ({
  [`&.${classes.download}`]: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  }
}));

interface TSVDownloadProps {
  queryResponse: gapi.client.analytics.GaData
}

const TSVDownload: React.FC<TSVDownloadProps> = ({ queryResponse }) => {


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
    <Root className={classes.download} href={csvContents} download={filename}>
      <GetApp />
      download .tsv
    </Root>
  );
}

export default TSVDownload
