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

import * as React from "react"

import { Typography, TextField } from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { FancyOption } from "../../components/FancyOption"

export enum SamplingLevel {
  Default = "DEFAULT",
  Faster = "FASTER",
  HigherPrecision = "HIGHER_PRECISION",
}

interface SamplingLevelProps {
  onSamplingLevelChange: (samplingLevel: SamplingLevel) => void
}

export const SamplingLevelComponent: React.FC<SamplingLevelProps> = ({
  onSamplingLevelChange,
}) => {
  const [samplingLevel, setSamplingLevel] = React.useState(
    SamplingLevel.Default
  )

  React.useEffect(() => {
    onSamplingLevelChange(samplingLevel)
  }, [samplingLevel])

  // TODO - This doesn't need to be the autocomplete component. It can just be a Select.
  return (
    <Autocomplete<SamplingLevel, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      debug
      options={[
        SamplingLevel.Default,
        SamplingLevel.HigherPrecision,
        SamplingLevel.Faster,
      ]}
      getOptionLabel={option => option}
      value={samplingLevel}
      onChange={(_event, value, _state) =>
        setSamplingLevel(value as SamplingLevel)
      }
      renderOption={option => (
        <FancyOption>
          <Typography variant="body1">{option}</Typography>
        </FancyOption>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Sampling Level"
          helperText="The sampling level to use for the query"
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export default SamplingLevelComponent
