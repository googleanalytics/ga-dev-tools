import * as React from "react"
import { Autocomplete, TextField } from "@mui/material"
import { Label } from "./types"

const timezones = Intl.supportedValuesOf("timeZone")

interface TimezoneSelectProps {
  selectedTimezone: string
  setSelectedTimezone: (timezone: string) => void
}

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  selectedTimezone,
  setSelectedTimezone,
}) => {
  return (
    <Autocomplete
      options={timezones}
      value={selectedTimezone}
      onChange={(_, newValue) => {
        if (newValue) {
          setSelectedTimezone(newValue)
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={Label.TimezoneSelect}
          variant="outlined"
          size="small"
        />
      )}
    />
  )
}

export default TimezoneSelect
