import { Typography } from "@material-ui/core"
import React from "react"
import { StorageKey } from "@/constants"
import useAccountPropertyStream from "../StreamPicker/useAccountPropertyStream"
import StreamPicker from "../StreamPicker"
import ExploreTable from "./ExploreTable"

enum QueryParam {
  Account = "a",
  Property = "b",
  Stream = "c",
}

const AccountExplorer = () => {
  const aps = useAccountPropertyStream(
    StorageKey.ga4AccountExplorerAPS,
    QueryParam
  )

  return (
    <>
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        Use this tool to search or browse through your Google Analytics 4
        accounts, properties, and streams, See what accounts you have access to
        and find the IDs that you need for APIs or other tools or services that
        integrate with Google Analytics.
      </Typography>
      <StreamPicker {...aps} streams />
      <ExploreTable />
    </>
  )
}

export default AccountExplorer
