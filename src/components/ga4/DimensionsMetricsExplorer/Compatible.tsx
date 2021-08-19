import { SAB } from "@/components/Buttons"
import { Chip, makeStyles, Paper, Typography } from "@material-ui/core"
import { navigate } from "gatsby"
import * as React from "react"
import QueryExplorerLink from "../QueryExplorer/BasicReport/QueryExplorerLink"
import { CompatibleHook } from "./useCompatibility"

const useStyles = makeStyles(theme => ({
  compatible: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  chipGroup: {
    display: "flex",
    alignItems: "baseline",
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

  // TODO - should this show unconditionally, or only after a dimension or
  // metric is picked.
  if (
    (dimensions === undefined || dimensions.length === 0) &&
    (metrics === undefined || metrics.length === 0)
  ) {
    return null
  }
  return (
    <Paper className={classes.compatible}>
      <Typography variant="h3">Fields in Request</Typography>
      <div className={classes.chipGroup}>
        {dimensions && dimensions.length > 0 && (
          <Typography>Dimensions:</Typography>
        )}
        {dimensions?.map(d => (
          <Chip
            key={d.apiName}
            label={d.apiName}
            color="primary"
            onClick={() => navigate(`#${d.apiName}`)}
            onDelete={() => removeDimension(d)}
          />
        ))}
      </div>
      <div className={classes.chipGroup}>
        {metrics && metrics.length > 0 && <Typography>Metrics:</Typography>}
        {metrics?.map(m => (
          <Chip
            key={m.apiName}
            label={m.apiName}
            color="secondary"
            onDelete={() => removeMetric(m)}
          />
        ))}
      </div>
      <SAB delete small onClick={reset}>
        Clear fields
      </SAB>
      <Typography>
        Use these fields in the{" "}
        <QueryExplorerLink dimensions={dimensions} metrics={metrics} />
      </Typography>
    </Paper>
  )
}

export default Compatible
