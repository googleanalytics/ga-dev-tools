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

import { SAB } from "@/components/Buttons"
import useFormStyles from "@/hooks/useFormStyles"
import { IsCustomEventCtx, ModifyParameterCtx } from "./EditEvent"
import EditParameter from "./EditParameter"
import { Parameter, ParameterType } from "./types"
import { ShowAdvancedCtx } from "."
import { Typography } from "@material-ui/core"

interface ParameterListProps {
  indentation?: number
  isItemParameter?: boolean
  isCustomEvent?: boolean
  parameters: Parameter[]
}

const ParameterList: React.FC<ParameterListProps> = ({
  isItemParameter,
  parameters,
  children,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)
  const formClasses = useFormStyles()
  const {
    addParameter,
    updateName,
    removeParameter,
    updateParameter,
  } = React.useContext(ModifyParameterCtx)!
  const isCustomEvent = React.useContext(IsCustomEventCtx)

  const hasItemsParameter = React.useMemo(
    () => parameters.find(p => p.type === ParameterType.Items) !== undefined,
    [parameters]
  )

  const buttons = (showAdvanced || isItemParameter || isCustomEvent) && (
    <>
      <Typography style={{ paddingBottom: "4px" }}>
        {isItemParameter ? "Add item parameter" : "Add parameter"}
      </Typography>
      <div className={formClasses.buttonRow}>
        <SAB add small onClick={() => addParameter("string")}>
          string
        </SAB>
        <SAB add small onClick={() => addParameter("number")}>
          number
        </SAB>
        {!hasItemsParameter && !isItemParameter && (
          <SAB add small onClick={() => addParameter("items")}>
            items
          </SAB>
        )}
        {children}
      </div>
    </>
  )

  return (
    <div>
      {parameters.map((parameter, idx) => {
        const key = `${parameter.name}-${idx}`
        const editParameter = (
          <EditParameter
            remove={() => removeParameter(idx)}
            updateName={(nuName: string) => updateName(idx, nuName)}
            key={key}
            parameter={parameter}
            updateParameter={parameter => updateParameter(idx, parameter)}
          />
        )
        if (idx === parameters.length - 1) {
          if (parameter.type === ParameterType.Items) {
            return (
              <React.Fragment key={key}>
                {buttons}
                {editParameter}
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment key={key}>
                {editParameter}
                {buttons}
              </React.Fragment>
            )
          }
        }
        return editParameter
      })}
      {(isItemParameter || isCustomEvent) && parameters.length === 0 && buttons}
    </div>
  )
}

export default ParameterList
