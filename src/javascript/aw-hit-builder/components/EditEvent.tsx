import React from "react";
import IconButton from "../../components/icon-button";
import { MPEvent, defaultOptionalString } from "../types";
import EditParameter from "./EditParameter";

interface EditEventProps {
  event: MPEvent;
  updateEvent: (event: MPEvent) => void;
}

const EditEvent: React.FC<EditEventProps> = ({ event, updateEvent }) => {
  const parameters = React.useMemo(() => event.getParameters(), [event]);
  const customParameters = React.useMemo(() => event.getCustomParameters(), [
    event
  ]);
  const updateParameter = React.useCallback(
    (parameterName: string) => (value: any) => {
      updateEvent(event.updateParameter(parameterName, value));
    },
    [event]
  );
  const updateCustomParameter = React.useCallback(
    (parameterName: string) => (value: any) => {
      updateEvent(event.updateCustomParameter(parameterName, value));
    },
    [event]
  );
  const addCustomParameter = React.useCallback(() => {
    updateEvent(event.addCustomParameter("", defaultOptionalString()));
  }, [event]);
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
            values, the hit above will be automatically updated.
          </p>
        </>
      )}
      {parameters.map(parameter => (
        <EditParameter
          key={parameter.parameterName}
          parameter={parameter}
          updateParameter={updateParameter(parameter.parameterName)}
          event={event}
          updateEvent={updateEvent}
        />
      ))}
      {customParameters.length > 0 && (
        <>
          <h4>Custom Parameters</h4>
          {customParameters.map(parameter => (
            <EditParameter
              customParam
              key={parameter.parameterName}
              parameter={parameter}
              updateParameter={updateCustomParameter(parameter.parameterName)}
              event={event}
              updateEvent={updateEvent}
            />
          ))}
        </>
      )}
      <div className="HitBuilderParam HitBuilderParam--action">
        <div className="HitBuilderParam-body">
          <IconButton
            type="add-circle"
            iconStyle={{ color: "hsl(150,60%,40%)" }}
            onClick={addCustomParameter}
          >
            Add Custom parameter
          </IconButton>
        </div>
      </div>
    </>
  );
};
export default EditEvent;
