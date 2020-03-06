import React from "react";
import Icon from "../../../components/icon";
import {
  Parameter,
  ParameterType,
  defaultParameterFor,
  MPEvent
} from "../../types";

import EditParameterValue from "./EditParameterValue";

interface CustomParamLabelProps {
  name: string;
  updateName: (oldName: string, newName: string) => void;
  remove: () => void;
}

const CustomLabel: React.FC<CustomParamLabelProps> = ({
  name,
  updateName,
  remove
}) => {
  const [localName, setLocalName] = React.useState(name);

  const updateCustomParameterName = React.useCallback(() => {
    if (name !== localName) {
      updateName(name, localName);
    }
  }, [localName, name, updateName]);

  return (
    <div className="HitBuilderParam-label">
      <span
        className="HitBuilderParam-removeIcon"
        tabIndex={1}
        title="Remove this parameter"
        onClick={remove}
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

interface EditParameterProps {
  custom?: {
    updateName: (oldName: string, newName: string) => void;
    remove: () => void;
  };
  parameter: Parameter;
  updateParameter: (nu: Parameter) => void;
}

const EditParameter: React.FC<EditParameterProps> = ({
  custom,
  parameter,
  updateParameter
}) => {
  return (
    <div className="HitBuilderParam">
      {custom !== undefined ? (
        <CustomLabel
          name={parameter.name}
          updateName={custom.updateName}
          remove={custom.remove}
        />
      ) : (
        <label className="HitBuilderParam-label">{parameter.name}</label>
      )}
      <EditParameterValue
        parameter={parameter}
        updateParameter={updateParameter}
      />
      {custom !== undefined && (
        <select
          className="FormField ParameterTypeDropdown"
          value={parameter.type}
          onChange={e => {
            const newParameterType: ParameterType = e.target
              .value as ParameterType;
            updateParameter(
              defaultParameterFor(newParameterType, parameter.name)
            );
          }}
        >
          {MPEvent.parameterTypeOptions()
            .filter(a => a !== ParameterType.RequiredArray)
            .map(option => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};

export default EditParameter;
