import React from "react";
import {
  MPEvent,
  defaultOptionalString,
  Parameters,
  Parameter
} from "../types";
import ParameterList from "./ParameterList";

interface EditEventProps {
  event: MPEvent;
  updateEvent: (event: MPEvent) => void;
}

const EditEvent: React.FC<EditEventProps> = ({ event, updateEvent }) => {
  const parameters = React.useMemo<Parameter[]>(() => event.getParameters(), [
    event
  ]);

  const customParameters = React.useMemo<Parameter[]>(
    () => event.getCustomParameters(),
    [event]
  );

  const updateParameters = React.useCallback(
    (update: (old: Parameters) => Parameters): void => {
      updateEvent(event.updateParameters(update));
    },
    [parameters, updateEvent, event]
  );

  const updateCustomParameters = React.useCallback(
    (update: (old: Parameters) => Parameters): void => {
      updateEvent(event.updateCustomParameters(update));
    },
    [customParameters, updateEvent, event]
  );

  const addCustomParameter = React.useCallback(() => {
    updateEvent(event.addCustomParameter("", defaultOptionalString("")));
  }, [event, updateEvent]);

  return (
    <>
      <h3>Event details</h3>
      {parameters.length === 0 ? (
        <p>No parameters are needed for this event</p>
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
        addCustomParameter={addCustomParameter}
        parameters={parameters}
        customParameters={customParameters}
        updateParameters={updateParameters}
        updateCustomParameters={updateCustomParameters}
      />
    </>
  );
};
export default EditEvent;
