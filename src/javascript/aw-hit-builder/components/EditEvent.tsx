import React from "react";
import { MPEvent, EventParameter } from "../types";

interface EditParameterProps {
  parameter: EventParameter;
}

const EditParameter: React.FC<EditParameterProps> = ({ parameter }) => {
  return (
    <ul>
      <li>{parameter.parameterName}</li>
      <li>{parameter.parameterValue}</li>
      <li>{parameter.parameterType}</li>
      <li>{parameter.required.toString()}</li>
    </ul>
  );
};

interface EditEventProps {
  event: MPEvent;
}

const EditEvent: React.FC<EditEventProps> = ({ event }) => {
  const parameters = React.useMemo(() => event.getParameters(), [event]);
  return (
    <div>
      <div>Event Type: {event.getEventType()}</div>
      <div>
        {parameters.length === 0 ? (
          <div>No parameters are needed for this event.</div>
        ) : (
          parameters.map(parameter => <EditParameter parameter={parameter} />)
        )}
      </div>
    </div>
  );
};
export default EditEvent;
