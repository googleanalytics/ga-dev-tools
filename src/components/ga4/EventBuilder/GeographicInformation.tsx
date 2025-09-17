import React from "react"
import Chip from "@mui/material/Chip";
import Divider from '@mui/material/Divider';
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"

import LinkedTextField from "@/components/LinkedTextField"
import ExternalLink from "@/components/ExternalLink"
import { Label } from "./types"

const Root = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(3),
}))

interface GeographicInformationProps {
  user_location_city: string | undefined
  setUserLocationCity: (value: string) => void
  user_location_region_id: string | undefined
  setUserLocationRegionId: (value: string) => void
  user_location_country_id: string | undefined
  setUserLocationCountryId: (value: string) => void
  user_location_subcontinent_id: string | undefined
  setUserLocationSubcontinentId: (value: string) => void
  user_location_continent_id: string | undefined
  setUserLocationContinentId: (value: string) => void
  ip_override: string | undefined
  setIpOverride: (value: string) => void
}

const GeographicInformation: React.FC<GeographicInformationProps> = ({
  user_location_city,
  setUserLocationCity,
  user_location_region_id,
  setUserLocationRegionId,
  user_location_country_id,
  setUserLocationCountryId,
  user_location_subcontinent_id,
  setUserLocationSubcontinentId,
  user_location_continent_id,
  setUserLocationContinentId,
  ip_override,
  setIpOverride,
}) => {
  return (
    <Root>
      <Divider><Chip label="GEOGRAPHIC INFORMATION" size="small" /></Divider>
      <Typography variant="h6">User Location</Typography>
      <Typography>
        See the{" "}
        <ExternalLink href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#user_location">
          documentation
        </ExternalLink>{" "}
        for more information about user location attributes.
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={Label.City}
            id={Label.City}
            variant="outlined"
            size="small"
            value={user_location_city || ""}
            onChange={e => setUserLocationCity(e.target.value)}
            helperText="The city name, e.g., Mountain View"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={Label.RegionId}
            id={Label.RegionId}
            variant="outlined"
            size="small"
            value={user_location_region_id || ""}
            onChange={e => setUserLocationRegionId(e.target.value)}
            helperText="The country and subdivision, e.g., US-CA"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={Label.CountryId}
            id={Label.CountryId}
            variant="outlined"
            size="small"
            value={user_location_country_id || ""}
            onChange={e => setUserLocationCountryId(e.target.value)}
            helperText="The country code, e.g., US"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={Label.ContinentId}
            id={Label.ContinentId}
            variant="outlined"
            size="small"
            value={user_location_continent_id || ""}
            onChange={e => setUserLocationContinentId(e.target.value)}
            helperText="The continent code, e.g., 019"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={Label.SubcontinentId}
            id={Label.SubcontinentId}
            variant="outlined"
            size="small"
            value={user_location_subcontinent_id || ""}
            onChange={e => setUserLocationSubcontinentId(e.target.value)}
            helperText="The subcontinent code, e.g., 021"
          />
        </Grid>
      </Grid>
      <Typography variant="h6">IP Override</Typography>
      <Typography>
        Provide an IP address to derive the user's geographic location. If
        both an IP override and user location are provided, user location will
        be used.
      </Typography>
      <LinkedTextField
        label={Label.IpOverride}
        id={Label.IpOverride}
        linkTitle="See ip_override on devsite."
        href="https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#ip_override"
        value={ip_override || ""}
        onChange={setIpOverride}
        helperText="The IP address of the user."
      />
    </Root>
  )
}

export default GeographicInformation
