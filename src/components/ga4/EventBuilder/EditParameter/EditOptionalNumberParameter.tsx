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

import { NumberParam } from "../types"

interface EditOptionalNumberParameterProps {
  parameter: NumberParam
  updateParameter: (nu: NumberParam) => void
  className?: string
}

const EditOptionalNumberParameter: React.FC<EditOptionalNumberParameterProps> = ({
  parameter,
  updateParameter,
  className,
}) => {
  const [localValue, setLocalValue] = React.useState<string>(
    parameter.value === undefined ? "" : parameter.value.toString()
  )

  const updateWithLocalParameter = React.useCallback(() => {
    const parsed = parseFloat(localValue)
    if (isNaN(parsed)) {
      return updateParameter({ ...parameter, value: undefined })
    }
    if (parsed !== parameter.value) {
      return updateParameter({ ...parameter, value: parsed })
    }
  }, [localValue, parameter, updateParameter])

  return (
    <TextField
      error={localValue.length > 0 && Number.isNaN(parseFloat(localValue))}
      inputMode="numeric"
      variant="outlined"
      label="number value"
      className={className}
      size="small"
      value={localValue}
      onChange={e => {
        setLocalValue(e.target.value)
      }}
      onBlur={updateWithLocalParameter}
    />
  )
}

export default EditOptionalNumberParameter
