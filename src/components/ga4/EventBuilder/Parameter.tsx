import * as React from "react"

import TextField from "@mui/material/TextField"
import { Parameter as ParameterT } from "./types"
import { ShowAdvancedCtx } from "."
import { IconButton, Tooltip, Grid } from "@mui/material"
import { Delete } from "@mui/icons-material"

interface Props {
  parameter: ParameterT
  setParamName: (name: string) => void
  setParamValue: (value: string) => void
  setParamTimestamp: (value: number) => void
  removeParam: () => void
  isUserProperty: boolean
}

const Parameter: React.FC<Props> = ({
  parameter,
  setParamName,
  setParamValue,
  setParamTimestamp,
  removeParam,
  isUserProperty,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)

  const [name, setName] = React.useState(parameter.name)
  const [value, setValue] = React.useState(parameter.value || "")
  const [timestamp, setTimestamp] = React.useState(
    parameter.timestamp_micros?.toString() || ""
  )

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
      {isUserProperty && (
        <Grid item xs>
          <TextField
            variant="outlined"
            size="small"
            value={timestamp}
            onChange={e => setTimestamp(e.target.value)}
            onBlur={() => setParamTimestamp(parseInt(timestamp, 10))}
            label="timestamp micros"
            helperText="The timestamp to be applied to the user property. Optional."
            fullWidth
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
