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

import Button from "@material-ui/core/Button"
import AddCircle from "@material-ui/icons/AddCircle"

import EditParameter from "./EditParameter"
import { Parameter, Parameters as ParametersT } from "./types"

interface ParameterListProps {
  indentation?: number
  parameters: Parameter[]
  updateParameters: (update: (old: ParametersT) => ParametersT) => void
  addParameter: () => void
  isNested: boolean
}

const ParameterList: React.FC<ParameterListProps> = ({
  indentation,
  parameters,
  updateParameters,
  addParameter,
  children,
  isNested,
}) => {
  const updateParameter = React.useCallback(
    (parameter: Parameter) => (nu: Parameter) => {
      updateParameters(old =>
        old.map(p => (p.name === parameter.name ? nu : p))
      )
    },
    [updateParameters]
  )

  const updateName = React.useCallback(
    (oldName: string, nuName: string) => {
      updateParameters(old =>
        old.map(p => (p.name === oldName ? { ...p, name: nuName } : p))
      )
    },
    [updateParameters]
  )

  const remove = React.useCallback(
    (parameter: Parameter) => () => {
      updateParameters(old => old.filter(p => p.name !== parameter.name))
    },
    [updateParameters]
  )

  return (
    <div className={`ParameterList indent-${indentation}`}>
      {parameters.map(parameter => (
        <EditParameter
          remove={remove(parameter)}
          updateName={updateName}
          isNested={isNested}
          key={parameter.name}
          parameter={parameter}
          updateParameter={updateParameter(parameter)}
        />
      ))}
      <div className="HitBuilderParam buttons">
        <Button
          color="primary"
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={addParameter}
        >
          Parameter
        </Button>
        {children}
      </div>
    </div>
  )
}

export default ParameterList
