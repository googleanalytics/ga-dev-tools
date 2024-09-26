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
import Autocomplete from '@mui/material/Autocomplete';
import {Dimension, Metric} from '@/components/ga4/DimensionsMetricsExplorer/useDimensionsAndMetrics';
import TextField from '@mui/material/TextField';

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

type CompatibleProps =
    CompatibleHook
    & {
  property: PropertySummary | undefined,
  allMetrics: Metric[],
  allDimensions: Dimension[]
}
const WithProperty: React.FC<CompatibleProps> = ({
       dimensions,
       metrics,
       removeMetric,
       removeDimension, setDimensions, setMetrics,
       property,
       hasFieldSelected, incompatibleDimensions, incompatibleMetrics,
       allDimensions,
       allMetrics,
     }) => {


  if (property === undefined) {
    return null
  }

  return (
      <>
        <Typography>
          As you choose dimensions & metrics, they will be added here.
          Incompatible dimensions & metrics will be grayed out.
        </Typography>
        <div className={classes.chipGrid}>
          <Typography className={classes.chipLabel}>Dimensions:</Typography>
          <div className={classes.chips}>
            <Autocomplete<Dimension, true>
                fullWidth
                autoComplete
                multiple
                isOptionEqualToValue={(a, b) => a.apiName === b.apiName}
                onChange={(event, value) => setDimensions(value)}
                value={dimensions || []}
                options={allDimensions}
                getOptionDisabled={(option) =>
                     incompatibleDimensions?.find(d => d.apiName === option.apiName) !== undefined
                }
                getOptionLabel={dimension => `${dimension.apiName}: ${dimension.uiName}` || ""}
                renderInput={params => (
                    <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        helperText={
                          <>
                            Select dimensions.
                          </>
                        }
                    />
                )}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                      return (
                          <Chip
                              key={option.apiName}
                              label={option.apiName}
                              onClick={() => navigate(`#${option.apiName}`)}
                              onDelete={() => removeDimension(option)}
                          />
                      );
                    })
                }
            />
          </div>
          <Typography className={classes.chipLabel}>Metrics:</Typography>
          <div className={classes.chips}>
            <Autocomplete<Metric, true>
                fullWidth
                autoComplete
                multiple
                isOptionEqualToValue={(a, b) => a.apiName === b.apiName}
                onChange={(event, value) => setMetrics(value)}
                value={metrics || []}
                options={allMetrics}
                getOptionDisabled={(option) =>
                    incompatibleMetrics?.find(d => d.apiName === option.apiName) !== undefined
                }
                getOptionLabel={metric => `${metric.apiName}: ${metric.uiName}` || ""}
                renderInput={params => (
                    <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        helperText={
                          <>
                            Select metrics.
                          </>
                        }
                    />
                )}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                      return (
                          <Chip
                              key={option.apiName}
                              label={option.apiName}
                              onClick={() => navigate(`#${option.apiName}`)}
                              onDelete={() => removeMetric(option)}
                          />
                      );
                    })
                }
            />
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
    CompatibleHook & {  allDimensions: Dimension[], allMetrics: Metric[], property: PropertySummary | undefined }
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
