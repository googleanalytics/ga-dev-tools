import React from "react";
import Icon from "../../components/icon";
import { MPEvent, EventParameter } from "../types";

interface CustomParamLabelProps {
  updateEvent: (event: MPEvent) => void;
  event: MPEvent;
  parameter: EventParameter;
}

const CustomParamLabel: React.FC<CustomParamLabelProps> = ({
  updateEvent,
  event,
  parameter
}) => {
  const [localName, setLocalName] = React.useState(parameter.parameterName);

  const removeCustomParameter = React.useCallback(() => {
    updateEvent(event.removeCustomParameter(parameter.parameterName));
  }, [event, updateEvent]);

  const updateCustomParameterName = React.useCallback(() => {
    if (parameter.parameterName !== localName) {
      updateEvent(
        event.updateCustomParameterName(parameter.parameterName, localName)
      );
    }
  }, [event, updateEvent, localName]);

  return (
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
  );
};

const EditStringParameter: React.FC<EditParameterValueProps> = ({
  parameter,
  updateParameter
}) => {
  const [localValue, setLocalValue] = React.useState(parameter.parameterValue);

  const updateWithLocalParameter = React.useCallback(() => {
    if (localValue !== parameter.parameterValue) {
      updateParameter(localValue);
    }
  }, [localValue]);

  return (
    <input
      className="FormField"
      value={localValue}
      onChange={e => {
        setLocalValue(e.target.value);
      }}
      onBlur={updateWithLocalParameter}
    />
  );
};

interface EditParameterValueProps {
  parameter: EventParameter;
  updateParameter: (nu: any) => void;
}

const EditParameterValue: React.FC<EditParameterValueProps> = props => {
  switch (props.parameter.parameterType) {
    case "string":
      return <EditStringParameter {...props} />;
    default:
      return null;
  }
};

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
  // TODO, there should be different edit options based on the type of the
  // Parameter. For example, if the type is items, we should have a way to add
  // individual items.

  return (
    <div className="HitBuilderParam">
      {customParam ? (
        <CustomParamLabel
          updateEvent={updateEvent}
          event={event}
          parameter={parameter}
        />
      ) : (
        <label className="HitBuilderParam-label">
          {parameter.parameterName}
        </label>
      )}
      <EditParameterValue
        parameter={parameter}
        updateParameter={updateParameter}
      />
    </div>
  );
};

export default EditParameter;
