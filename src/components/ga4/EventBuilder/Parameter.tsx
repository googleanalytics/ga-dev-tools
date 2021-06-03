import * as React from "react"

import TextField from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"

import { Parameter as ParameterT } from "./types"
import { ShowAdvancedCtx } from "."
import useFormStyles from "@/hooks/useFormStyles"
import { IconButton, Tooltip } from "@material-ui/core"
import { Delete } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
  parameter: {
    display: "flex",
    "&> *": {
      flexGrow: 1,
    },
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

interface Props {
  parameter: ParameterT
  setParamName: (name: string) => void
  setParamValue: (value: string) => void
  removeParam: () => void
}

const Parameter: React.FC<Props> = ({
  parameter,
  setParamName,
  setParamValue,
  removeParam,
}) => {
  const classes = useStyles()
  const formClasses = useFormStyles()
  const showAdvanced = React.useContext(ShowAdvancedCtx)

  const [name, setName] = React.useState(parameter.name)
  const [value, setValue] = React.useState(parameter.value || "")

  const inputs = (
    <section className={classes.parameter}>
      <TextField
        variant="outlined"
        size="small"
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={() => setParamName(name)}
        label="name"
      />
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
      />
    </section>
  )
  if (showAdvanced) {
    return (
      <section className={formClasses.trashRow}>
        <Tooltip title="remove parameter">
          <IconButton onClick={removeParam}>
            <Delete />
          </IconButton>
        </Tooltip>
        {inputs}
      </section>
    )
  }
  return inputs
}

export default Parameter
