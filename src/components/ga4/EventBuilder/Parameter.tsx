import * as React from "react"

import { styled } from '@mui/material/styles';
import TextField from "@mui/material/TextField"
import { Parameter as ParameterT } from "./types"
import { ShowAdvancedCtx } from "."
import { IconButton, Tooltip } from "@mui/material"
import { Delete } from "@mui/icons-material"

const PREFIX = 'Parameter';

const classes = {
  parameter: `${PREFIX}-parameter`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`&.${classes.parameter}`]: {
    display: "flex",
    "&> *": {
      flexGrow: 1,
    },
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  }
}));

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

  const showAdvanced = React.useContext(ShowAdvancedCtx)

  const [name, setName] = React.useState(parameter.name)
  const [value, setValue] = React.useState(parameter.value || "")

  const inputs = (
    <Root className={classes.parameter}>
      <TextField
        id={`#/events/0/params/${name}`}
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
    </Root>
  )
  if (showAdvanced) {
    return (
      <section /* className={formClasses.trashRow} */>
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
