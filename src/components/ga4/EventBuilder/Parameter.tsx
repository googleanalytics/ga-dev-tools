import * as React from "react"

import TextField from "@mui/material/TextField"
import { Parameter as ParameterT } from "./types"
import { ShowAdvancedCtx } from "."
import {
  IconButton,
  Tooltip,
  Grid
} from "@mui/material"
import { Delete } from "@mui/icons-material"
import TimestampPicker from "./TimestampPicker"
import { TimestampScope } from "@/constants"

interface Props {
  parameter: ParameterT
  idx: number
  setParamName: (name: string) => void
  setParamValue: (value: string) => void
  setParamTimestamp: (idx: number, value: number | undefined) => void
  removeParam: () => void
  allowTimestampOverride: boolean
}

const Parameter: React.FC<Props> = ({
  parameter,
  idx,
  setParamName,
  setParamValue,
  setParamTimestamp,
  removeParam,
  allowTimestampOverride,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)

  const [name, setName] = React.useState(parameter.name)
  const [value, setValue] = React.useState(parameter.value || "")
  const [timestamp, setTimestamp] = React.useState(
    parameter.timestamp_micros?.toString() || ""
  )

  React.useEffect(() => {
    const num = parseInt(timestamp, 10)
    setParamTimestamp(idx, isNaN(num) ? undefined : num)
  }, [timestamp, setParamTimestamp, idx])

  const inputs = (
    <Grid container spacing={1}>
      <Grid item xs>
        <TextField
          id={`#/events/0/params/${name}`}
          variant="outlined"
          size="small"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={() => setParamName(name)}
          label="name"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          variant="outlined"
          size="small"
          value={value || ""}
          InputLabelProps={{
            ...(parameter.exampleValue === undefined ? {} : { shrink: true }),
          }}
          onChange={e => setValue(e.target.value)}
          onBlur={() => setParamValue(value)}
          label={`${parameter.type} value`}
          placeholder={parameter.exampleValue?.toString()}
          fullWidth
        />
      </Grid>
      {allowTimestampOverride && (
        <Grid item xs={12}>
            <TimestampPicker
              timestamp={timestamp}
              scope={TimestampScope.USER_PROPERTY}
              setTimestamp={setTimestamp}
            />
        </Grid>
      )}
    </Grid>
  )
  if (showAdvanced) {
    return (
      <Grid container spacing={1} alignItems="flex-start">
        <Grid item>
          <Tooltip title="remove parameter">
            <IconButton onClick={removeParam}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs>
          {inputs}
        </Grid>
      </Grid>
    )
  }
  return inputs
}

export default Parameter