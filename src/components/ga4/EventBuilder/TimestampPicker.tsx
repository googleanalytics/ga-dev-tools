import * as React from "react"
import {
  Grid,
  Tooltip,
  IconButton,
  Popover,
  Box,
} from "@mui/material"
import { Refresh, Public } from "@mui/icons-material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { UseFirebaseCtx } from "."
import { Label } from "./types"
import LinkedTextField from "@/components/LinkedTextField"
import TimezoneSelect from "./TimezoneSelect"
import { TimestampScope } from "@/constants"
dayjs.extend(utc)
dayjs.extend(timezone)

interface TimestampPickerProps {
  timestamp: string
  scope: string
  setTimestamp: (value: string) => void
}

const TimestampPicker: React.FC<TimestampPickerProps> = ({
  timestamp,
  scope,
  setTimestamp,
}) => {

  const useFirebase = React.useContext(UseFirebaseCtx)
  const [selectedTimezone, setSelectedTimezone] = React.useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  const [error, setError] = React.useState("")
  const [timezoneAnchorEl, setTimezoneAnchorEl] =
    React.useState<HTMLButtonElement | null>(null)

  const handleTimezoneOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimezoneAnchorEl(event.currentTarget)
  }

  const handleTimezoneClose = () => {
    setTimezoneAnchorEl(null)
  }

  const timezonePopoverOpen = Boolean(timezoneAnchorEl)
  const timezonePopoverId = timezonePopoverOpen ? "timezone-popover" : undefined

  const handleTimezoneChange = (newTimezone: string) => {
    if (timestamp && !isNaN(parseInt(timestamp, 10))) {
      const currentTime = dayjs
        .utc(parseInt(timestamp, 10) / 1000)
        .tz(selectedTimezone)

      const newTime = currentTime.tz(newTimezone, true)
      const newTimestamp = newTime.valueOf() * 1000
      setTimestamp(newTimestamp.toString())
    }
    setSelectedTimezone(newTimezone)
  }

  const validate = (value: string) => {
    if (value === "") {
      setError("")
      return true
    }
    const num = parseInt(value, 10)
    if (isNaN(num)) {
      setError("Timestamp must be a number.")
      return false
    }
    if (num < 0) {
      setError("Timestamp must be a positive number.")
      return false
    }
    setError("")
    return true
  }

  const docsBaseUrl = "https://developers.google.com/analytics/devguides/collection/protocol/ga4"
  const clientType = useFirebase ? "firebase" : "gtag"
  const href =
    scope === TimestampScope.USER_PROPERTY
      ? `${docsBaseUrl}/user-properties?client_type=${clientType}#override_timestamp`
      : `${docsBaseUrl}/sending-events?client_type=${clientType}#override_timestamp`

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={selectedTimezone}
    >
      <Box sx={{ border: "1px solid", borderColor: "divider", p: 2, borderRadius: 1 }}>
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs>
        <LinkedTextField
          size="medium"
          value={timestamp}
          error={error !== ""}
          helperText={
            error !== ""
              ? error
              : `The timestamp of the ${scope}. Optional.`
          }
          onChange={value => {
            setTimestamp(value)
            validate(value)
          }}
          label={Label.TimestampMicros}
          linkTitle="Go to documentation"
          href={href}
          extraAction={
            <Tooltip title="Set to current time">
              <IconButton
                size="small"
                onClick={() => {
                  const newTimestamp = new Date().getTime() * 1000
                  setTimestamp(newTimestamp.toString())
                  setError("")
                }}
              >
              <Refresh />
              </IconButton>
            </Tooltip>
          }
        />
          </Grid>
          <Grid item>
          <DateTimePicker
            ampm={false}
            views={["year", "month", "day", "hours", "minutes", "seconds"]}
            value={
              timestamp && !isNaN(parseInt(timestamp, 10))
                ? dayjs
                    .utc(parseInt(timestamp, 10) / 1000)
                    .tz(selectedTimezone)
                : null
            }
            onChange={newValue => {
              if (newValue) {
                const newTimestamp = newValue.valueOf() * 1000
                setTimestamp(newTimestamp.toString())
                setError("")
              }
            }}
            slotProps={{ textField: { helperText: " " } }}
          />
          </Grid>
          <Grid item sx={{ mt: 1 }}>
          <Tooltip title="Select timezone">
            <IconButton onClick={handleTimezoneOpen}>
              <Public />
            </IconButton>
          </Tooltip>
          <Popover
            id={timezonePopoverId}
            open={timezonePopoverOpen}
            anchorEl={timezoneAnchorEl}
            onClose={handleTimezoneClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{ p: 2, minWidth: "300px" }}>
              <TimezoneSelect
                selectedTimezone={selectedTimezone}
                setSelectedTimezone={handleTimezoneChange}
              />
            </Box>
          </Popover>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  )
}

export default TimestampPicker