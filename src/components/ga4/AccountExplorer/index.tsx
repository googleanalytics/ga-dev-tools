import * as React from "react"
import { useState } from "react"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import TextField from "@material-ui/core/TextField"
import StreamPicker from "../StreamPicker"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}))

const AccountExplorer: React.FC = () => {
  const classes = useStyles()
  const [searchQuery, setSearchQuery] = useState("")
  return (
    <>
      <Typography variant="h2">Overview</Typography>
      <Typography variant="body1">
        Use this tool to search or browse through your accounts, properties, and
        views, See what accounts you have access to, and find the IDs that you
        need for the API or for another tool or service that integrates with
        Google Analytics.
      </Typography>
      <Paper className={classes.paper}>
        <header>
          <div>
            <Typography variant="h3">
              Search for your account information&hellip;
            </Typography>
            <TextField
              placeholder="Start typing to search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Typography variant="h3">
              &hellip;or browse through all your accounts
            </Typography>
            <StreamPicker />
          </div>
        </header>
      </Paper>
    </>
  )
}

export default AccountExplorer
