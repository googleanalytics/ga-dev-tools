import React from "react";
import classnames from "classnames";
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
  isNested: boolean;
}

const EditParameter: React.FC<EditParameterProps> = ({
  custom,
  parameter,
  updateParameter,
  isNested
}) => {
  const isItem = parameter.type === ParameterType.RequiredArray;
  const className = classnames("HitBuilderParam", {
    "HitBuilderParam--item": isItem
  });

  const label = React.useMemo(
    () =>
      custom !== undefined ? (
        <CustomLabel
          name={parameter.name}
          updateName={custom.updateName}
          remove={custom.remove}
        />
      ) : (
        <label className="HitBuilderParam-label">{parameter.name}</label>
      ),
    [parameter, custom]
  );

  const parameterDropdown = React.useMemo(
    () =>
      custom !== undefined ? (
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
            .filter(a => (isNested ? a !== ParameterType.RequiredArray : true))
            .map(option => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
        </select>
      ) : null,
    [parameter.type]
  );

  return (
    <div className={className}>
      {isItem ? (
        <>
          <div className="HitBuilderParam">
            {label}
            {parameterDropdown}
          </div>
          <div className="HitBuilderParam--items">
            <EditParameterValue
              parameter={parameter}
              updateParameter={updateParameter}
            />
          </div>
        </>
      ) : (
        <>
          {label}
          <EditParameterValue
            parameter={parameter}
            updateParameter={updateParameter}
          />
          {parameterDropdown}
        </>
      )}
    </div>
  );
};

export default EditParameter;
