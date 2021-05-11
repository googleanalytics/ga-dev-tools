// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import TextField from "@material-ui/core/TextField"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Remove from "@material-ui/icons/Delete"

import EditParameterValue from "./EditParameterValue"
import { Parameter, ParameterType } from "../types"
import { ShowAdvancedCtx } from ".."
import { IsCustomEventCtx } from "../EditEvent"

const useStyles = makeStyles(theme => ({
  itemParameterRow: {
    display: "flex",
    "& > div": {
      marginRight: theme.spacing(1),
    },
  },
  parameterRow: {
    display: "flex",
    alignItems: "center",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(1),
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
  updateName: (nuName: string) => void
}

const CustomLabel: React.FC<CustomParamLabelProps> = ({ name, updateName }) => {
  const classes = useStyles()
  const [localName, setLocalName] = React.useState(name)

  React.useEffect(() => {
    setLocalName(name)
  }, [name])

  const updateCustomParameterName = React.useCallback(() => {
    updateName(localName)
  }, [localName, updateName])

  return (
    <TextField
      variant="outlined"
      size="small"
      className={classes.customLabel}
      label="name"
      value={localName}
      onChange={e => setLocalName(e.target.value)}
      onBlur={updateCustomParameterName}
    />
  )
}

interface EditParameterProps {
  remove: () => void
  parameter: Parameter
  updateParameter: (nu: Parameter) => void
  updateName: (nuName: string) => void
}

const EditParameter: React.FC<EditParameterProps> = ({
  updateName,
  remove,
  parameter,
  updateParameter,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)
  const isCustomEvent = React.useContext(IsCustomEventCtx)
  const classes = useStyles()
  const isItem = parameter.type === ParameterType.Items

  const removeParameter = React.useMemo(() => {
    if (showAdvanced || isItem || isCustomEvent) {
      return (
        <Tooltip title="remove parameter">
          <IconButton onClick={remove} size="small">
            <Remove />
          </IconButton>
        </Tooltip>
      )
    }
    return null
  }, [remove, showAdvanced, isItem, isCustomEvent])

  return (
    <div>
      {isItem ? (
        <EditParameterValue
          parameter={parameter}
          remove={remove}
          updateParameter={updateParameter}
        />
      ) : (
        <section className={classes.parameterRow}>
          {removeParameter}
          <CustomLabel name={parameter.name} updateName={updateName} />
          <EditParameterValue
            remove={remove}
            parameter={parameter}
            updateParameter={updateParameter}
          />
        </section>
      )}
    </div>
  )
}

export default EditParameter
