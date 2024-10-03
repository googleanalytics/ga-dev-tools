import * as React from "react"
import { navigate } from "gatsby"

import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import BugIcon from "@mui/icons-material/BugReport"

const BugReport: React.FC = () => {
  const onClick = React.useCallback(() => {
    navigate(
      "https://github.com/googleanalytics/ga-dev-tools/issues/new?assignees=&labels=&template=bug_report.md&title="
    )
  }, [])

  return (
    <Tooltip title="Report an issue.">
      <IconButton onClick={onClick}>
        <BugIcon />
      </IconButton>
    </Tooltip>
  )
}

export default BugReport
