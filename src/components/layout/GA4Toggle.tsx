import * as React from "react"

import Grid from "@material-ui/core/Grid/Grid"
import Switch from "@material-ui/core/Switch"
import Tooltip from "@material-ui/core/Tooltip"

import { GAVersion } from "@/constants"

interface GA4ToggleProps {
  gaVersion: GAVersion
  setGAVersion: (version: GAVersion) => void
}

const GA4Toggle: React.FC<GA4ToggleProps> = ({ setGAVersion, gaVersion }) => {
  return (
    <Tooltip title="Switch between UA and GA4 demos & tools">
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>UA</Grid>
        <Grid item>
          <Switch
            checked={gaVersion === GAVersion.GoogleAnalytics4}
            onChange={e => {
              if (e.target.checked === true) {
                setGAVersion(GAVersion.GoogleAnalytics4)
              } else {
                setGAVersion(GAVersion.UniversalAnalytics)
              }
            }}
            name="use GA4"
            color="primary"
          />
        </Grid>
        <Grid item>GA4</Grid>
      </Grid>
    </Tooltip>
  )
}

export default GA4Toggle
