import React from "react";
import { MPEvent, EventParameter } from "../types";

interface EditParameterProps {
  parameter: EventParameter;
  updateParameter: (nu: any) => void;
}

const EditParameter: React.FC<EditParameterProps> = ({
  parameter,
  updateParameter
}) => {
  // TODO, there should be different edit options based on the type of the Parameter.
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label">{parameter.parameterName}</label>
      <input
        className="FormField"
        value={parameter.parameterValue}
        onChange={e => {
          updateParameter(e.target.value);
        }}
      />
    </div>
  );
};

interface EditEventProps {
  event: MPEvent;
  updateEvent: (event: MPEvent) => void;
}

const EditEvent: React.FC<EditEventProps> = ({ event, updateEvent }) => {
  const parameters = React.useMemo(() => event.getParameters(), [event]);
  const updateParameter = React.useCallback(
    (parameterName: string) => (value: any) => {
      updateEvent(event.updateParameter(parameterName, value));
    },
    [parameters]
  );
  return (
    <>
      {parameters.length === 0 ? (
        <div>No parameters are needed for this event.</div>
      ) : (
        parameters.map(parameter => (
          <EditParameter
            parameter={parameter}
            updateParameter={updateParameter(parameter.parameterName)}
          />
        ))
      )}
    </>
  );
};
export default EditEvent;
