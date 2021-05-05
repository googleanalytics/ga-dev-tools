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
import { MPEvent, Parameters, defaultStringParam } from "./types"

interface EditEventProps {
  event: MPEvent
  setEvent: React.Dispatch<React.SetStateAction<MPEvent>>
}

const EditEvent: React.FC<EditEventProps> = ({ event, setEvent }) => {
  const parameters = event.getParameters()

  const defaultEventParameters = React.useMemo(() => {
    return MPEvent.empty(event.getEventType()).getParameters()
  }, [event])

  const updateParameters = React.useCallback(
    (update: (old: Parameters) => Parameters): void => {
      setEvent(event.updateParameters(update))
    },
    [setEvent, event]
  )

  const addParameter = React.useCallback(() => {
    setEvent(event.addParameter("", defaultStringParam("")))
  }, [event, setEvent])

  return (
    <>
      <Typography variant="h3">Event details</Typography>
      {parameters.length === 0 && defaultEventParameters.length === 0 ? (
        <Typography>No parameters are recommended for this event</Typography>
      ) : (
        <>
          <Typography variant="h4">Parameters</Typography>
          <Typography>
            The fields below are a breakdown of the individual parameters and
            values for the event in the text box above. When you update these
            values, the event above will be automatically updated.
          </Typography>
        </>
      )}
      <ParameterList
        isNested={false}
        addParameter={addParameter}
        parameters={parameters}
        updateParameters={updateParameters}
      />
    </>
  )
}
export default EditEvent
