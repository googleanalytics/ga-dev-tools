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

import Typography from "@material-ui/core/Typography"

import ParameterList from "./ParameterList"
import {
  MPEvent,
  Parameters,
  defaultStringParam,
  defaultNumberParam,
  defaultItemArrayParam,
  Parameter,
} from "./types"
import useFormStyles from "@/hooks/useFormStyles"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { Dispatch } from "@/types"
import { ShowAdvancedCtx } from "."

interface EditEventProps {
  event: MPEvent
  setEvent: React.Dispatch<React.SetStateAction<MPEvent>>
  setShowAdvanced: Dispatch<boolean>
}

type AddParameter = (type: "string" | "number" | "items") => void
type UpdateName = (idx: number, nuName: string) => void
type UpdateParameter = (idx: number, nuParamater: Parameter) => void
type RemoveParameter = (idx: number) => void
export const ModifyParameterCtx = React.createContext<
  | {
      addParameter: AddParameter
      updateName: UpdateName
      removeParameter: RemoveParameter
      updateParameter: UpdateParameter
    }
  | undefined
>(undefined)

export const IsCustomEventCtx = React.createContext(false)

const EditEvent: React.FC<EditEventProps> = ({
  event,
  setEvent,
  setShowAdvanced,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)
  const formClasses = useFormStyles()
  const parameters = event.getParameters()

  const updateParameters = React.useCallback(
    (update: (old: Parameters) => Parameters): void => {
      setEvent(event.updateParameters(update))
    },
    [setEvent, event]
  )

  const updateParameter: UpdateParameter = React.useCallback(
    (idx: number, nu: Parameter): void => {
      updateParameters(old => old.map((p, i) => (idx === i ? nu : p)))
    },
    [updateParameters]
  )

  const addParameter = React.useCallback(
    (type: "string" | "number" | "items") => {
      const nuParam =
        type === "string"
          ? defaultStringParam("")
          : type === "number"
          ? defaultNumberParam("")
          : defaultItemArrayParam(false)
      setEvent(event.addParameter(nuParam))
    },
    [event, setEvent]
  )

  const updateName = React.useCallback(
    (idx: number, nuName: string) => {
      updateParameters(old =>
        old.map((p, i) => (i === idx ? { ...p, name: nuName } : p))
      )
    },
    [updateParameters]
  )

  const removeParameter = React.useCallback(
    (idx: number) => {
      updateParameters(old => old.filter((_, i) => i !== idx))
    },
    [updateParameters]
  )

  const paramHeading = React.useMemo(() => {
    if (parameters.length === 0) {
      if (event.isCustomEvent()) {
        return (
          <Typography>No parameters are configured for this event</Typography>
        )
      } else {
        return (
          <Typography>No parameters are recommended for this event</Typography>
        )
      }
    } else {
      return <Typography variant="h5">Parameters</Typography>
    }
  }, [event, parameters])

  return (
    <section className={formClasses.form}>
      <LabeledCheckbox checked={showAdvanced} setChecked={setShowAdvanced}>
        show advanced options
      </LabeledCheckbox>
      {paramHeading}
      <IsCustomEventCtx.Provider value={event.isCustomEvent()}>
        <ModifyParameterCtx.Provider
          value={{ addParameter, updateName, removeParameter, updateParameter }}
        >
          <ParameterList parameters={parameters} />
        </ModifyParameterCtx.Provider>
      </IsCustomEventCtx.Provider>
    </section>
  )
}
export default EditEvent
