import React from "react"
import ParameterList from "./_ParameterList"
import {
  MPEvent,
  Parameter,
  Parameters,
  defaultStringParam,
} from "./_types/_index"
import { Typography } from "@material-ui/core"

interface EditEventProps {
  event: MPEvent
  setEvent: React.Dispatch<React.SetStateAction<MPEvent>>
}

const EditEvent: React.FC<EditEventProps> = ({ event, setEvent }) => {
  const parameters = React.useMemo<Parameter[]>(() => event.getParameters(), [
    event.getParameters(),
  ])

  const defaultEventParameters = React.useMemo(() => {
    return MPEvent.empty(event.getEventType()).getParameters()
  }, [event.getEventType()])

  const updateParameters = React.useCallback(
    (update: (old: Parameters) => Parameters): void => {
      setEvent(event.updateParameters(update))
    },
    [parameters, setEvent, event]
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
