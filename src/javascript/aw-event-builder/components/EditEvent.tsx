import React from "react";
import { MPEvent, defaultStringParam, Parameters, Parameter } from "../types";
import ParameterList from "./ParameterList";

interface EditEventProps {
  event: MPEvent;
  updateEvent: (event: MPEvent) => void;
}

const EditEvent: React.FC<EditEventProps> = ({ event, updateEvent }) => {
  const parameters = React.useMemo<Parameter[]>(() => event.getParameters(), [
    event
  ]);

  const defaultEventParameters = React.useMemo(() => {
    return MPEvent.empty(event.getEventType()).getParameters();
  }, [event.getEventType()]);

  const updateParameters = React.useCallback(
    (update: (old: Parameters) => Parameters): void => {
      updateEvent(event.updateParameters(update));
    },
    [parameters, updateEvent, event]
  );

  const addParameter = React.useCallback(() => {
    updateEvent(event.addParameter("", defaultStringParam("")));
  }, [event, updateEvent]);

  return (
    <>
      <h3>Event details</h3>
      {parameters.length === 0 && defaultEventParameters.length === 0 ? (
        <p>No parameters are recommended for this event</p>
      ) : (
        <>
          <h4>Parameters</h4>
          <p>
            The fields below are a breakdown of the individual parameters and
            values for the event in the text box above. When you update these
            values, the event above will be automatically updated.
          </p>
        </>
      )}
      <ParameterList
        isNested={false}
        addParameter={addParameter}
        parameters={parameters}
        updateParameters={updateParameters}
      />
    </>
  );
};
export default EditEvent;
