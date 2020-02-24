import React from "react";
import Icon from "../../components/icon";
import IconButton from "../../components/icon-button";
import { MPEvent, EventParameter, defaultOptionalString } from "../types";

interface EditParameterProps {
  customParam?: true;
  parameter: EventParameter;
  updateParameter: (nu: any) => void;
  event: MPEvent;
  updateEvent: (event: MPEvent) => void;
}

const EditParameter: React.FC<EditParameterProps> = ({
  event,
  updateEvent,
  customParam,
  parameter,
  updateParameter
}) => {
  const [localName, setLocalName] = React.useState(parameter.parameterName);
  const removeCustomParameter = React.useCallback(() => {
    updateEvent(event.removeCustomParameter(parameter.parameterName));
  }, [event, updateEvent]);
  const updateCustomParameterName = React.useCallback(() => {
    updateEvent(
      event.updateCustomParameterName(parameter.parameterName, localName)
    );
  }, [event, updateEvent, localName]);
  // TODO, there should be different edit options based on the type of the
  // Parameter. For example, if the type is items, we should have a way to add
  // individual items.
  return (
    <div className="HitBuilderParam">
      {customParam ? (
        <div className="HitBuilderParam-label">
          <span
            className="HitBuilderParam-removeIcon"
            tabIndex={1}
            title="Remove this parameter"
            onClick={removeCustomParameter}
          >
            <Icon type="remove-circle" />
          </span>
          <input
            className="FormField HitBuilderParam-inputLabel"
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            onBlur={updateCustomParameterName}
          />
        </div>
      ) : (
        <label className="HitBuilderParam-label">
          {parameter.parameterName}
        </label>
      )}
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
