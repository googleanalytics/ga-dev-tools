import React from "react";
import Icon from "../../components/icon";
import IconButton from "../../components/icon-button";
import {
  MPEvent,
  EventParameter,
  ParameterType,
  ItemArrayParameter,
  Item,
  OptionalStringParameter
} from "../types";

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

interface EditStringParameterProps {
  parameter: OptionalStringParameter;
  updateParameter: (nu: any) => void;
}

const EditStringParameter: React.FC<EditStringParameterProps> = ({
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

interface EditItemArrayParameterProps {
  items: ItemArrayParameter;
  updateParameter: (nu: any) => void;
}

const EditArrayParameter: React.FC<EditItemArrayParameterProps> = ({
  items,
  updateParameter
}) => {
  const [localValues, setLocalValues] = React.useState<Array<Item>>(
    items.parameterValue
  );
  const addItem = React.useCallback(() => {
    setLocalValues(old => {
      const nu = old.concat([{ name: "" }]);
      updateParameter(nu);
      return nu;
    });
  }, []);

  const updateLocalValue = React.useCallback(
    (idx: number) => (nu: Item) =>
      setLocalValues(old => old.map((item, i) => (idx === i ? nu : item))),
    []
  );

  const updateWithLocalParameter = React.useCallback(() => {
    if (localValues !== items.parameterValue) {
      updateParameter(localValues);
    }
  }, [localValues]);

  return (
    <div className="HitBuilderParam--items">
      <IconButton
        type="add-circle"
        iconStyle={{ color: "hsl(150,60%,40%)" }}
        onClick={addItem}
      >
        Add Item
      </IconButton>
      {localValues.map((localValue, idx) => (
        <div className="HitBuilderParam--item">
          <label>Item {idx + 1}</label>
          {Object.entries(localValue).map(([key, value], idx2) => (
            <div key={`${idx}-${idx2}-${key}`} className="HitBuilderParam">
              <label className="HitBuilderParam-label">{key}</label>
              <input
                className="FormField"
                value={value}
                onChange={e => {
                  updateLocalValue(idx)({
                    ...localValue,
                    [key]: e.target.value
                  });
                }}
                onBlur={updateWithLocalParameter}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

interface EditParameterValueProps {
  parameter: EventParameter;
  updateParameter: (nu: any) => void;
}

const EditParameterValue: React.FC<EditParameterValueProps> = ({
  parameter,
  updateParameter
}) => {
  switch (parameter.parameterType) {
    case ParameterType.OptionalString:
      return (
        <EditStringParameter
          parameter={parameter}
          updateParameter={updateParameter}
        />
      );
    case ParameterType.RequiredArray:
      return (
        <EditArrayParameter
          items={parameter}
          updateParameter={updateParameter}
        />
      );
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
