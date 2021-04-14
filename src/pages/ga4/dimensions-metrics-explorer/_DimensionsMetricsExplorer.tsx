import * as React from "react"
import { useDimensionsAndMetrics, useInputs } from "./_hooks"
import { Typography, TextField, IconButton } from "@material-ui/core"
import InlineCode from "../../../components/InlineCode"
import { Clear } from "@material-ui/icons"
import GA4PropertySelector from "../../../components/GA4PropertySelector"

const DimensionsMetricsExplorer: React.FC = () => {
  const { search, setSearch } = useInputs()
  const { metrics, dimensions } = useDimensionsAndMetrics("0")

  const visibleDimensions = React.useMemo(
    () =>
      dimensions?.filter(dimension =>
        dimension.uiName?.toLowerCase().includes(search)
      ),
    [search, dimensions]
  )

  const visibleMetrics = React.useMemo(
    () =>
      metrics?.filter(metric => metric.uiName?.toLowerCase().includes(search)),
    [search, metrics]
  )

  return (
    <>
      <GA4PropertySelector />
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        size="small"
        value={search || ""}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setSearch("")}>
              <Clear />{" "}
            </IconButton>
          ),
        }}
      />
      <Typography variant="h2">Dimensions</Typography>
      {visibleDimensions?.map(dimension => (
        <div key={dimension.apiName}>
          <Typography variant="h3">
            {dimension.uiName} <InlineCode>{dimension.apiName}</InlineCode>
          </Typography>
          <Typography>{dimension.description}</Typography>
        </div>
      ))}
      <Typography variant="h2">Metrics</Typography>
      {visibleMetrics?.map(metric => (
        <div key={metric.apiName}>
          <Typography variant="h3">
            {metric.uiName} <InlineCode>{metric.apiName}</InlineCode>
          </Typography>
          <Typography>{metric.description}</Typography>
        </div>
      ))}
    </>
  )
}

export default DimensionsMetricsExplorer
