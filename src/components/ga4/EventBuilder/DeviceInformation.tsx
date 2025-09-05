import React from "react"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"

import ExternalLink from "@/components/ExternalLink"

const Root = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(1),
}))

type DeviceInformationProps = {
  device_category: string | undefined
  setDeviceCategory: (value: string) => void
  device_language: string | undefined
  setDeviceLanguage: (value: string) => void
  device_screen_resolution: string | undefined
  setDeviceScreenResolution: (value: string) => void
  device_operating_system: string | undefined
  setDeviceOperatingSystem: (value: string) => void
  device_operating_system_version: string | undefined
  setDeviceOperatingSystemVersion: (value: string) => void
  device_model: string | undefined
  setDeviceModel: (value: string) => void
  device_brand: string | undefined
  setDeviceBrand: (value: string) => void
  device_browser: string | undefined
  setDeviceBrowser: (value: string) => void
  device_browser_version: string | undefined
  setDeviceBrowserVersion: (value: string) => void
}

const DeviceInformation: React.FC<DeviceInformationProps> = ({
  device_category,
  setDeviceCategory,
  device_language,
  setDeviceLanguage,
  device_screen_resolution,
  setDeviceScreenResolution,
  device_operating_system,
  setDeviceOperatingSystem,
  device_operating_system_version,
  setDeviceOperatingSystemVersion,
  device_model,
  setDeviceModel,
  device_brand,
  setDeviceBrand,
  device_browser,
  setDeviceBrowser,
  device_browser_version,
  setDeviceBrowserVersion,
}) => {
  const docHref =
    "https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#device"
  return (
    <Root>
      <Divider>
        <Chip label="DEVICE INFORMATION" size="small" />
      </Divider>
      <Typography variant="h6">Device</Typography>
      <Typography>
        See the{" "}
        <ExternalLink href={docHref}>documentation</ExternalLink> for more
        information about device attributes.
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-category"
            label="Device category"
            variant="outlined"
            size="small"
            value={device_category || ""}
            onChange={e => setDeviceCategory(e.target.value)}
            helperText="The device category. E.g., 'mobile', 'desktop'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-language"
            label="Device language"
            variant="outlined"
            size="small"
            value={device_language || ""}
            onChange={e => setDeviceLanguage(e.target.value)}
            helperText="The language of the device. E.g., 'en-us'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-screen-resolution"
            label="Device screen resolution"
            variant="outlined"
            size="small"
            value={device_screen_resolution || ""}
            onChange={e => setDeviceScreenResolution(e.target.value)}
            helperText="The screen resolution of the device. E.g., '1920x1080'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-operating-system"
            label="Device operating system"
            variant="outlined"
            size="small"
            value={device_operating_system || ""}
            onChange={e => setDeviceOperatingSystem(e.target.value)}
            helperText="The operating system of the device. E.g., 'Windows'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-operating-system-version"
            label="Device operating system version"
            variant="outlined"
            size="small"
            value={device_operating_system_version || ""}
            onChange={e => setDeviceOperatingSystemVersion(e.target.value)}
            helperText="The operating system version of the device. E.g., '10'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-model"
            label="Device model"
            variant="outlined"
            size="small"
            value={device_model || ""}
            onChange={e => setDeviceModel(e.target.value)}
            helperText="The device model. E.g., 'Pixel 6'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-brand"
            label="Device brand"
            variant="outlined"
            size="small"
            value={device_brand || ""}
            onChange={e => setDeviceBrand(e.target.value)}
            helperText="The device brand. E.g., 'Google'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-browser"
            label="Device browser"
            variant="outlined"
            size="small"
            value={device_browser || ""}
            onChange={e => setDeviceBrowser(e.target.value)}
            helperText="The browser name. E.g., 'Chrome'."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-browser-version"
            label="Device browser version"
            variant="outlined"
            size="small"
            value={device_browser_version || ""}
            onChange={e => setDeviceBrowserVersion(e.target.value)}
            helperText="The browser version. E.g., '108.0.0.0'."
          />
        </Grid>
      </Grid>
    </Root>
  )
}

export default DeviceInformation