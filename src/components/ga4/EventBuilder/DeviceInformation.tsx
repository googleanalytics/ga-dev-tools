import React, { useContext } from "react"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"

import ExternalLink from "@/components/ExternalLink"
import { Label } from "./types"
import { UseFirebaseCtx } from "."

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
  user_agent: string | undefined
  setUserAgent: (value: string) => void
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
  user_agent,
  setUserAgent,
}) => {
  const useFirebase = useContext(UseFirebaseCtx)
  const docHref =
    "https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#device"
  return (
    <Root>
      <Divider>
        <Chip label="DEVICE INFORMATION" size="small" />
      </Divider>
      <Typography variant="h6">Device Attributes</Typography>
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
            label={Label.DeviceCategory}
            variant="outlined"
            size="small"
            value={device_category || ""}
            onChange={e => setDeviceCategory(e.target.value)}
            helperText="The category of the device, e.g., mobile, desktop"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-language"
            label={Label.DeviceLanguage}
            variant="outlined"
            size="small"
            value={device_language || ""}
            onChange={e => setDeviceLanguage(e.target.value)}
            helperText="The language of the device in ISO 639-1 format, e.g., en"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-screen-resolution"
            label={Label.DeviceScreenResolution}
            variant="outlined"
            size="small"
            value={device_screen_resolution || ""}
            onChange={e => setDeviceScreenResolution(e.target.value)}
            helperText="The screen resolution of the device, e.g., 1920x1080"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-operating-system"
            label={Label.DeviceOperatingSystem}
            variant="outlined"
            size="small"
            value={device_operating_system || ""}
            onChange={e => setDeviceOperatingSystem(e.target.value)}
            helperText="The device's operating system, e.g., MacOS, Windows"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-operating-system-version"
            label={Label.DeviceOperatingSystemVersion}
            variant="outlined"
            size="small"
            value={device_operating_system_version || ""}
            onChange={e => setDeviceOperatingSystemVersion(e.target.value)}
            helperText="The version of the device's operating system, e.g., 13.5"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-model"
            label={Label.DeviceModel}
            variant="outlined"
            size="small"
            value={device_model || ""}
            onChange={e => setDeviceModel(e.target.value)}
            helperText="The model of the device, e.g., Pixel 6"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-brand"
            label={Label.DeviceBrand}
            variant="outlined"
            size="small"
            value={device_brand || ""}
            onChange={e => setDeviceBrand(e.target.value)}
            helperText="The brand of the device, e.g., Google"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-browser"
            label={Label.DeviceBrowser}
            variant="outlined"
            size="small"
            value={device_browser || ""}
            onChange={e => setDeviceBrowser(e.target.value)}
            helperText="The brand or type of browser, e.g., Chrome"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="device-browser-version"
            label={Label.DeviceBrowserVersion}
            variant="outlined"
            size="small"
            value={device_browser_version || ""}
            onChange={e => setDeviceBrowserVersion(e.target.value)}
            helperText="The browser version, e.g., 136.0.7103.60"
          />
        </Grid>
      </Grid>
      {!useFirebase && (
        <>
          <Typography variant="h6">User Agent</Typography>
          <Typography>
            Specify a user agent string for Google Analytics to use to derive device information. 
            This field is ignored if device information is provided.
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="user-agent"
                label={Label.UserAgent}
                variant="outlined"
                size="small"
                value={user_agent || ""}
                onChange={e => setUserAgent(e.target.value)}
                helperText="The user agent string."
              />
            </Grid>
          </Grid>
        </>
      )}
    </Root>
  )
}

export default DeviceInformation