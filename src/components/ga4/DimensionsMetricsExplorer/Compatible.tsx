import { PropertySummary } from "@/types/ga4/StreamPicker"
import { styled } from '@mui/material/styles';
import {
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material"
import { Replay } from "@mui/icons-material"
import { navigate } from "gatsby"
import * as React from "react"
import QueryExplorerLink from "../QueryExplorer/BasicReport/QueryExplorerLink"
import { CompatibleHook } from "./useCompatibility"

const PREFIX = 'Compatible';

const classes = {
  compatible: `${PREFIX}-compatible`,
  chipGrid: `${PREFIX}-chipGrid`,
  chipLabel: `${PREFIX}-chipLabel`,
  chips: `${PREFIX}-chips`,
  removeButton: `${PREFIX}-removeButton`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`&.${classes.compatible}`]: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.chipGrid}`]: {
    display: "grid",
    gridTemplateColumns: "min-content 1fr",
    alignItems: "baseline",
  },

  [`& .${classes.chipLabel}`]: {
    justifySelf: "end",
    marginRight: theme.spacing(1),
  },

  [`& .${classes.chips}`]: {
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.removeButton}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

const WithProperty: React.FC<
  CompatibleHook & { property: PropertySummary | undefined }
> = ({
  dimensions,
  metrics,
  removeMetric,
  removeDimension,
  property,
  hasFieldSelected,
}) => {


  if (property === undefined) {
    return null
  }

  return (
    <>
      <Typography>
        As you choose dimensions & metrics (by clicking the checkbox next to
        their name), they will be added here. Incompatible dimensions & metrics
        will be grayed out.
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
      {hasFieldSelected && (
        <Typography>
          Use these fields in the{" "}
          <QueryExplorerLink dimensions={dimensions} metrics={metrics} />
        </Typography>
      )}
    </>
  )
}

const Compatible: React.FC<
  CompatibleHook & { property: PropertySummary | undefined }
> = props => {

  const { reset, property, hasFieldSelected } = props

  return (
    <StyledPaper className={classes.compatible}>
      <Typography variant="h3">
        Compatible Fields
        <IconButton disabled={!hasFieldSelected} onClick={reset}>
          <Replay />
        </IconButton>
      </Typography>
      <WithProperty {...props} property={property} />
      {property === undefined && (
        <Typography>
          Pick a property above to enable this functionality.
        </Typography>
      )}
    </StyledPaper>
  );
}

export default Compatible
