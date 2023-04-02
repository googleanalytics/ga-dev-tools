import React from "react"

import { Typography } from "@material-ui/core"
import { StorageKey } from "@/constants"
import StreamPicker from "../StreamPicker"
import ExploreTable from "./ExploreTable"
import useAccountProperty from "../StreamPicker/useAccountProperty"

enum QueryParam {
  Account = "a",
  Property = "b",
  Stream = "c",
}

const AccountExplorer = () => {
  const ap = useAccountProperty(StorageKey.ga4AccountExplorerAPS, QueryParam)

  return (
    <>
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        Use this tool to browse through your Google Analytics 4 accounts,
        properties, and streams, See what accounts you have access to and find
        the IDs that you need for APIs or other tools or services that integrate
        with Google Analytics 4.
      </Typography>
      <StreamPicker {...ap} />
      <ExploreTable {...ap} />
    </>
  )
}

export default AccountExplorer
