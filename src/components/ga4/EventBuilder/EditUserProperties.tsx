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

import AddCircle from "@material-ui/icons/AddCircle"

import { Parameters, defaultStringParam, Parameter } from "./types"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import EditParameter from "./EditParameter"

interface EditUserPropertiesProps {
  user_properties: Parameters
  setUserProperties: React.Dispatch<React.SetStateAction<Parameters>>
}

const EditUserProperties: React.FC<EditUserPropertiesProps> = ({
  user_properties,
  setUserProperties,
}) => {
  const addProperty = React.useCallback(() => {
    setUserProperties(old => old.concat([defaultStringParam("", true)]))
  }, [setUserProperties])

  const updatePropertyName = React.useCallback(
    (idx: number) => (_oldName: string, nuName: string) => {
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
    <>
      <Typography variant="h3">User Properties</Typography>
      {user_properties.length === 0 ? (
        <section>
          <Typography>No user properties configured.</Typography>
          <Button
            startIcon={<AddCircle />}
            variant="outlined"
            color="primary"
            onClick={addProperty}
          >
            User Property
          </Button>
        </section>
      ) : (
        <section>
          {user_properties.map((property, idx) => (
            <EditParameter
              key={`userProperty-${idx}`}
              updateParameter={updateProperty(idx)}
              isNested={false}
              parameter={property}
              updateName={updatePropertyName(idx)}
              remove={removeProperty(idx)}
            />
          ))}
          <Button
            startIcon={<AddCircle />}
            variant="outlined"
            onClick={addProperty}
          >
            User Property
          </Button>
        </section>
      )}
    </>
  )
}
export default EditUserProperties
