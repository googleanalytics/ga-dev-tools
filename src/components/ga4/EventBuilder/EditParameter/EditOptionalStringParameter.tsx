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

import TextField from "@material-ui/core/TextField"

import { StringParam } from "../types"

interface EditOptionalStringParameterProps {
  parameter: StringParam
  updateParameter: (nu: StringParam) => void
  className?: string
}

const EditOptionalStringParameter: React.FC<EditOptionalStringParameterProps> = ({
  parameter,
  updateParameter,
  className,
}) => {
  const [localValue, setLocalValue] = React.useState(parameter.value)

  const updateWithLocalParameter = React.useCallback(() => {
    if (localValue !== parameter.value) {
      updateParameter({ ...parameter, value: localValue })
    }
  }, [localValue, parameter, updateParameter])

  return (
    <TextField
      className={className}
      value={localValue}
      variant="outlined"
      size="small"
      label="string value"
      onChange={e => {
        setLocalValue(e.target.value)
      }}
      onBlur={updateWithLocalParameter}
    />
  )
}

export default EditOptionalStringParameter
