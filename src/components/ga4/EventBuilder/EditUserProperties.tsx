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

import clsx from "classnames"

import {
  Parameters,
  defaultStringParam,
  Parameter,
  defaultNumberParam,
} from "./types"
import Typography from "@material-ui/core/Typography"
import EditParameter from "./EditParameter"
import { SAB } from "@/components/Buttons"
import useFormStyles from "@/hooks/useFormStyles"

interface EditUserPropertiesProps {
  user_properties: Parameters
  setUserProperties: React.Dispatch<React.SetStateAction<Parameters>>
}

const EditUserProperties: React.FC<EditUserPropertiesProps> = ({
  user_properties,
  setUserProperties,
}) => {
  const formClasses = useFormStyles()
  const addProperty = React.useCallback(
    (type: "string" | "number") => {
      const nuParam =
        type === "string"
          ? defaultStringParam("", true)
          : defaultNumberParam("", true)
      setUserProperties(old => old.concat([nuParam]))
    },
    [setUserProperties]
  )

  const updatePropertyName = React.useCallback(
    (idx: number) => (nuName: string) => {
      setUserProperties(old =>
        old.map((property, i) =>
          idx === i ? { ...property, name: nuName } : property
        )
      )
    },
    [setUserProperties]
  )
  const removeProperty = React.useCallback(
    (idx: number) => () => {
      setUserProperties(old => old.filter((_, i) => i !== idx))
    },
    [setUserProperties]
  )
  const updateProperty = React.useCallback(
    (idx: number) => (nu: Parameter) => {
      setUserProperties(old =>
        old.map((current, i) => (i === idx ? nu : current))
      )
    },
    [setUserProperties]
  )
  return (
    <section className={formClasses.form}>
      <Typography variant="h5">User Properties</Typography>
      {user_properties.length === 0 ? (
        <section>
          <Typography>No user properties configured.</Typography>
        </section>
      ) : (
        user_properties.map((property, idx) => (
          <EditParameter
            key={`userProperty-${idx}`}
            updateParameter={updateProperty(idx)}
            parameter={property}
            updateName={updatePropertyName(idx)}
            remove={removeProperty(idx)}
          />
        ))
      )}
      <section
        className={clsx(formClasses.buttonRow, formClasses.marginBottom)}
      >
        <SAB
          add
          small
          onClick={() => addProperty("string")}
          title="add string user property"
        >
          string
        </SAB>
        <SAB
          add
          small
          onClick={() => addProperty("number")}
          title="add number user property"
        >
          number
        </SAB>
      </section>
    </section>
  )
}
export default EditUserProperties
