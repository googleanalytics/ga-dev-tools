import React from "react"
import classnames from "classnames"
import EditParameterValue from "./_EditParameterValue"
import { RemoveCircle } from "@material-ui/icons"
import {
  IconButton,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  makeStyles,
} from "@material-ui/core"
import {
  Parameter,
  ParameterType,
  defaultParameterFor,
  MPEvent,
} from "../_types/_index"

const useStyles = makeStyles(theme => ({
  parameter: {
    marginBottom: theme.spacing(1),
  },
  itemParameterRow: {
    display: "flex",
    "& > div": {
      marginRight: theme.spacing(1),
    },
  },
  parameterRow: {
    display: "flex",
    alignItems: "center",
    "& > div": {
      marginRight: theme.spacing(1),
    },
  },
  parameterType: {
    minWidth: theme.spacing(12),
  },
  customLabel: {
    flexGrow: 1,
  },
}))

interface CustomParamLabelProps {
  name: string
  updateName: (oldName: string, newName: string) => void
  remove: () => void
}

const CustomLabel: React.FC<CustomParamLabelProps> = ({
  name,
  updateName,
  remove,
}) => {
  const classes = useStyles()
  const [localName, setLocalName] = React.useState(name)
  // TODO - This shouldn't be necessary, but something funky is going on effect
  // wise. This will probably be easy to fix once I have the hooks linter turned
  // on.
  const [refresh, setForceRefresh] = React.useState(0)

  React.useEffect(() => {
    setLocalName(name)
  }, [name, refresh])

  const updateCustomParameterName = React.useCallback(() => {
    updateName(name, localName)
    setForceRefresh(a => a + 1)
  }, [localName, name, updateName])

  return (
    <TextField
      variant="outlined"
      size="small"
      className={classes.customLabel}
      label="Parameter name"
      value={localName}
      onChange={e => setLocalName(e.target.value)}
      onBlur={updateCustomParameterName}
      InputProps={{
        endAdornment: (
          <Tooltip title={`Remove ${localName} parameter`}>
            <IconButton tabIndex={1} onClick={remove} size="small">
              <RemoveCircle />
            </IconButton>
          </Tooltip>
        ),
      }}
    />
  )
}

interface EditParameterProps {
  updateName: (oldName: string, newName: string) => void
  remove: () => void
  parameter: Parameter
  updateParameter: (nu: Parameter) => void
  isNested: boolean
}

const EditParameter: React.FC<EditParameterProps> = ({
  updateName,
  remove,
  parameter,
  updateParameter,
  isNested,
}) => {
  const classes = useStyles()
  const isItem = parameter.type === ParameterType.Items

  return (
    <div className={classes.parameter}>
      {isItem ? (
        <>
          <section className={classes.itemParameterRow}>
            <CustomLabel
              name={parameter.name}
              updateName={updateName}
              remove={remove}
            />

            <Select
              className={classes.parameterType}
              value={parameter.type}
              onChange={e => {
                const newParameterType: ParameterType = e.target
                  .value as ParameterType
                updateParameter(
                  defaultParameterFor(newParameterType, parameter.name)
                )
              }}
            >
              {MPEvent.parameterTypeOptions()
                .filter(a => (isNested ? a !== ParameterType.Items : true))
                .map(option => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </section>
          <EditParameterValue
            parameter={parameter}
            updateParameter={updateParameter}
          />
        </>
      ) : (
        <section className={classes.parameterRow}>
          <CustomLabel
            name={parameter.name}
            updateName={updateName}
            remove={remove}
          />
          <EditParameterValue
            parameter={parameter}
            updateParameter={updateParameter}
          />
          <Select
            className={classes.parameterType}
            value={parameter.type}
            onChange={e => {
              const newParameterType: ParameterType = e.target
                .value as ParameterType
              updateParameter(
                defaultParameterFor(newParameterType, parameter.name)
              )
            }}
          >
            {MPEvent.parameterTypeOptions()
              .filter(a => (isNested ? a !== ParameterType.Items : true))
              .map(option => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>
        </section>
      )}
    </div>
  )
}

export default EditParameter
