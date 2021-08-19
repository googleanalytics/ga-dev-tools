import { useSetToast } from "@/hooks"
import {
  Chip,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core"
import { Replay } from "@material-ui/icons"
import { navigate } from "gatsby"
import * as React from "react"
import QueryExplorerLink from "../QueryExplorer/BasicReport/QueryExplorerLink"
import { CompatibleHook } from "./useCompatibility"

const useStyles = makeStyles(theme => ({
  compatible: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  chipGrid: {
    display: "grid",
    gridTemplateColumns: "min-content 1fr",
    alignItems: "baseline",
  },
  chipLabel: {
    justifySelf: "end",
    marginRight: theme.spacing(1),
  },
  chips: {
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  removeButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const Compatible: React.FC<CompatibleHook> = ({
  dimensions,
  metrics,
  removeMetric,
  removeDimension,
  reset,
}) => {
  const classes = useStyles()
  const setToast = useSetToast()

  return (
    <Paper className={classes.compatible}>
      <Typography variant="h3">
        Fields in Request{" "}
        <IconButton
          disabled={
            !(
              (dimensions !== undefined && dimensions.length > 0) ||
              (metrics !== undefined && metrics.length > 0)
            )
          }
          onClick={() => {
            reset()
            setToast("Reset request.")
          }}
        >
          <Replay />
        </IconButton>
      </Typography>
      <div className={classes.chipGrid}>
        <Typography className={classes.chipLabel}>Dimensions:</Typography>
        <div className={classes.chips}>
          {dimensions !== undefined && dimensions.length > 0
            ? dimensions.map(d => (
                <Chip
                  variant="outlined"
                  key={d.apiName}
                  label={d.apiName}
                  onClick={() => navigate(`#${d.apiName}`)}
                  onDelete={() => removeDimension(d)}
                />
              ))
            : "No dimensions selected."}
        </div>
        <Typography className={classes.chipLabel}>Metrics:</Typography>
        <div className={classes.chips}>
          {metrics !== undefined && metrics.length > 0
            ? metrics?.map(m => (
                <Chip
                  variant="outlined"
                  key={m.apiName}
                  label={m.apiName}
                  onDelete={() => removeMetric(m)}
                />
              ))
            : "No metrics selected."}
        </div>
      </div>
      {((dimensions !== undefined && dimensions.length > 0) ||
        (metrics !== undefined && metrics.length > 0)) && (
        <Typography>
          Use these fields in the{" "}
          <QueryExplorerLink dimensions={dimensions} metrics={metrics} />
        </Typography>
      )}
    </Paper>
  )
}

export default Compatible
