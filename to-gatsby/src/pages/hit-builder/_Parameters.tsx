import * as React from "react"

import actions from "./_actions"
import { v4 as uuid } from "uuid"
import Add from "@material-ui/icons/Add"
import Button from "@material-ui/core/Button"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  makeStyles,
  Typography,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Delete, Refresh } from "@material-ui/icons"
import { State, HIT_TYPES, Property } from "./_types"
import { useDispatch, useSelector } from "react-redux"

const useStyles = makeStyles(theme => ({
  subdued: {
    color: theme.palette.grey[500],
  },
  propertyOption: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    position: "relative",
    "& > span": {
      position: "absolute",
      right: theme.spacing(2),
    },
  },
  inputs: {
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
  addedParam: {
    display: "flex",
    "& > div:first-child": {
      marginRight: theme.spacing(1),
    },
    "& > div:nth-child(2)": {
      flexGrow: 1,
    },
  },
}))

const Parameters: React.FC = () => {
  const classes = useStyles()
  const { validationMessages, params, properties } = useSelector<State, State>(
    a => a
  )
  console.log("component", properties)
  const dispatch = useDispatch()

  const getValidationMessageForParam = React.useCallback(
    (paramName: string) => {
      const message = validationMessages.find(m => m.param === paramName)
      return message && message.description
    },
    [validationMessages]
  )

  const addParameter = React.useCallback(() => {
    setNewParamNeedsFocus(true)
    dispatch(actions.addParam)
  }, [dispatch])

  const removeParameter = React.useCallback(
    (id: number) => {
      dispatch(actions.removeParam(id))
    },
    [dispatch]
  )

  const updateParameterName = React.useCallback(
    (id: number, newName: string) => {
      dispatch(actions.editParamName(id, newName))
    },
    [dispatch]
  )

  const updateParameterValue = React.useCallback(
    (id: number, newValue: string) => {
      dispatch(actions.editParamValue(id, newValue))
    },
    []
  )

  const [v, t, tid, cid, ...otherParams] = params

  const setHitType = React.useCallback(
    hitType => {
      dispatch(actions.editParamValue(t.id, hitType))
    },
    [t.id, dispatch]
  )

  const setCid = React.useCallback(
    newId => {
      dispatch(actions.editParamValue(cid.id, newId))
    },
    [cid.value, dispatch]
  )

  const setTid = React.useCallback(
    newTid => {
      dispatch(actions.editParamValue(tid.id, newTid))
    },
    [tid.id, dispatch]
  )

  React.useEffect(() => {
    dispatch(actions.updateHitPayload)
  }, [t, v])

  return (
    <section className={classes.inputs}>
      <FormControl>
        <InputLabel>v</InputLabel>
        <Select value={1}>
          <MenuItem value={1}>1</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>t</InputLabel>
        <Select
          value={t.value}
          onChange={e => setHitType(e.target.value as string)}
        >
          {HIT_TYPES.map(hitType => (
            <MenuItem key={hitType} value={hitType}>
              {hitType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete<Property>
        blurOnSelect
        freeSolo
        openOnFocus
        autoSelect
        autoHighlight
        multiple={false}
        options={properties}
        getOptionLabel={a => a.id}
        onChange={(_, value) => {
          setTid(value?.id || "")
        }}
        filterOptions={(options, state) => {
          return options.filter(option => {
            return [option.group, option.id, option.name].find(v =>
              v.match(state.inputValue)
            )
          })
        }}
        renderOption={a => {
          return (
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
          )
        }}
        renderInput={params => (
          <TextField {...params} label="tid" placeholder="UA-XXXXX-Y" />
        )}
      />

      <TextField
        value={cid.value || ""}
        onChange={e => setCid(e.target.value)}
        label="cid"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Randomly generate UUID" placement="right">
                <IconButton onClick={() => setCid(uuid())}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      {otherParams.map(param => {
        const isLast = param === otherParams[otherParams.length - 1]
        return (
          <div className={classes.addedParam} key={param.id}>
            <TextField
              label="Parameter name"
              onChange={e => {
                updateParameterName(param.id, e.target.value)
              }}
            />
            <TextField
              label={
                (param.name && `Value for ${param.name}`) || "Parameter value"
              }
              onChange={e => {
                updateParameterValue(param.id, e.target.value)
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Remove parameter" placement="right">
                      <IconButton
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

      <Button startIcon={<Add />} onClick={addParameter} variant="outlined">
        Add parameter
      </Button>
    </section>
  )
}
export default Parameters
