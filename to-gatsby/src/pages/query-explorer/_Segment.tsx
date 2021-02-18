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
import { Segment } from "../../api"
import { FancyOption } from "../../components/FancyOption"

interface SegmentProps {
  segments: Segment[] | undefined
  setSelectedSegment: (segment: Segment | undefined) => void
}

export const SegmentComponent: React.FC<SegmentProps> = ({
  segments,
  setSelectedSegment,
}) => {
  const [localSegment, setLocalSegment] = React.useState<Segment>()

  React.useEffect(() => {
    setSelectedSegment(localSegment)
  }, [localSegment])

  return (
    <Autocomplete<Segment, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      debug
      options={segments || []}
      getOptionLabel={option => option.name!}
      value={localSegment || null}
      onChange={(_event, value, _state) => setLocalSegment(value as Segment)}
      renderOption={option => (
        <FancyOption
          right={
            <Typography variant="subtitle1" color="textSecondary">
              {option.segmentId}
            </Typography>
          }
        >
          <Typography variant="body1">{option.name}</Typography>
        </FancyOption>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Segment"
          helperText="The segment to use for the query."
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export default SegmentComponent
