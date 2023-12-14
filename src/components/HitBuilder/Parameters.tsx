import * as React from "react"

import { styled } from '@mui/material/styles';

import {Delete, Refresh} from "@mui/icons-material"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Autocomplete from "@mui/material/Autocomplete"
import Add from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import {v4 as uuid} from "uuid"

import {HIT_TYPES, Property} from "./types"
import {ParametersAPI, Validation} from "./hooks"

const PREFIX = 'Parameters';

const classes = {
  subdued: `${PREFIX}-subdued`,
  propertyOption: `${PREFIX}-propertyOption`,
  inputs: `${PREFIX}-inputs`,
  addedParam: `${PREFIX}-addedParam`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`& .${classes.subdued}`]: {
    color: theme.palette.grey[500],
  },

  [`& .${classes.propertyOption}`]: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    position: "relative",
    "& > span": {
      position: "absolute",
      right: theme.spacing(2),
    },
  },

  [`&.${classes.inputs}`]: {
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    "& > div": {
      margin: theme.spacing(1),
    },
    "& > button": {
      alignSelf: "flex-end",
      margin: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
  },

  [`& .${classes.addedParam}`]: {
    display: "flex",
    "& > div:first-child": {
      marginRight: theme.spacing(1),
    },
    "& > div:nth-child(2)": {
      flexGrow: 1,
    },
  }
}));

interface ParametersProps {
  updateParameterName: ParametersAPI["updateParameterName"]
  updateParameterValue: ParametersAPI["updateParameterValue"]
  removeParameter: ParametersAPI["removeParameter"]
  shouldFocus: ParametersAPI["shouldFocus"]
  addParameter: ParametersAPI["addParameter"]
  parameters: ParametersAPI["parameters"]
  properties: Property[]
  validationMessages: Validation["validationMessages"]
}
const Parameters: React.FC<ParametersProps> = ({
  updateParameterName,
  updateParameterValue,
  shouldFocus,
  removeParameter,
  addParameter,
  parameters,
  properties,
}) => {

  const newParam = React.useRef(null)
  const [v, t, tid, cid, ...otherParams] = parameters

  const setHitType = React.useCallback(
      (hitType: string) => {
      updateParameterValue(t.id, hitType)
    },
    [t.id, updateParameterValue]
  )

  const setCid = React.useCallback(
      (newId: string) => {
      updateParameterValue(cid.id, newId)
    },
    [cid.id, updateParameterValue]
  )

  const setTid = React.useCallback(
      (newTid: string) => {
      updateParameterValue(tid.id, newTid)
    },
    [tid.id, updateParameterValue]
  )
  const [localPropertyInput, setLocalPropertyInput] = React.useState("")

  React.useEffect(() => {
    if (tid.value !== localPropertyInput) {
      setLocalPropertyInput(tid.value as string)
    }
  }, [tid.value, localPropertyInput])

  return (
    <Root className={classes.inputs}>
      <FormControl size="small">
        <InputLabel id="v-label">v</InputLabel>
        <Select labelId="v-label" value={v.value} variant="outlined">
          <MenuItem value={1}>1</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete<typeof HIT_TYPES[0], boolean, undefined, boolean>
        id="t"
        data-testid={`change-t`}
        blurOnSelect
        openOnFocus
        autoHighlight
        autoSelect
        multiple={false}
        options={HIT_TYPES}
        freeSolo
        getOptionLabel={a => a}
        value={t.value as string}
        renderInput={params => (
          <TextField {...params} variant="outlined" size="small" label="t" />
        )}
        onChange={(_, value) => {
          typeof value === "string" && setHitType(value)
        }}
      />

      <Autocomplete<Property, boolean, undefined, boolean>
        id="tid"
        blurOnSelect
        freeSolo
        openOnFocus
        autoHighlight
        multiple={false}
        options={properties}
        getOptionLabel={ (a) => typeof a === "string" ? a : a.id}
        inputValue={localPropertyInput}
        onChange={(_, value) => {
          if (value !== null) {
            // TODO fix the type here later.
            setTid((value as any).id)
          }
        }}
        onInputChange={(_, value, reason) => {
          // Don't set the local property input if the reason was reset.
          if (reason === "clear" || reason === "input") {
            setLocalPropertyInput(value)
            setTid(value)
          }
        }}
        filterOptions={(options, state) => {
          return options.filter(option => {
            return [option.group, option.id, option.name].find(v =>
              v.match(state.inputValue)
            )
          })
        }}
        renderOption={(props, a) => {
          return (
              <Root>
                <div className={classes.propertyOption}>
                  <Typography variant="body1" component="div">
                    {a.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    className={classes.subdued}
                  >
                    {a.id}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    className={classes.subdued}
                  >
                    {a.group}
                  </Typography>
                </div>
              </Root>
          )
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="tid"
            placeholder="UA-XXXXX-Y"
            variant="outlined"
            size="small"
          />
        )}
      />

      <TextField
        id="cid"
        value={cid.value || ""}
        onChange={e => setCid(e.target.value)}
        label="cid"
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Randomly generate UUID" placement="right">
                <IconButton
                  data-testid="generate-uuid"
                  onClick={() => setCid(uuid())}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      {otherParams.map((param, idx) => {
        const isDuplicate =
          otherParams.find(
            other =>
              param.name !== "" &&
              other.id !== param.id &&
              param.name === other.name
          ) !== undefined
        const helperText = isDuplicate ? "Duplicate Parameter Name" : undefined
        return (
          <div className={classes.addedParam} key={`${param.id}-${idx}`}>
            <TextField
              variant="outlined"
              size="small"
              error={isDuplicate}
              helperText={helperText}
              autoFocus={shouldFocus(param.id, false)}
              ref={newParam}
              id={`${param.name}-label`}
              label="Parameter name"
              value={param.name}
              onChange={e => {
                updateParameterName(param.id, e.target.value)
              }}
            />
            <TextField
              variant="outlined"
              size="small"
              error={isDuplicate}
              autoFocus={shouldFocus(param.id, true)}
              id={`${param.name}-value`}
              label={
                (param.name && `Value for ${param.name}`) || "Parameter value"
              }
              value={param.value}
              onChange={e => {
                updateParameterValue(param.id, e.target.value)
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Remove parameter" placement="right">
                      <IconButton
                        data-testid={`remove-${param.name}`}
                        onClick={() => {
                          removeParameter(param.id)
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )
      })}

      <Button
        startIcon={<Add />}
        onClick={() => {
          addParameter()
        }}
        variant="outlined"
      >
        Add parameter
      </Button>
    </Root>
  );
}
export default Parameters
