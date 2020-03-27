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
  // TODO - This shouldn't be necessary, but something funky is going on effect
  // wise. This will probably be easy to fix once I have the hooks linter turned
  // on.
  const [refresh, setForceRefresh] = React.useState(0);

  React.useEffect(() => {
    setLocalName(name);
  }, [name, refresh]);

  const updateCustomParameterName = React.useCallback(() => {
    updateName(name, localName);
    setForceRefresh(a => a + 1);
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
        title={localName}
        onChange={e => setLocalName(e.target.value)}
        onBlur={updateCustomParameterName}
      />
    </div>
  );
};

interface EditParameterProps {
  updateName: (oldName: string, newName: string) => void;
  remove: () => void;
  parameter: Parameter;
  updateParameter: (nu: Parameter) => void;
  isNested: boolean;
}

const EditParameter: React.FC<EditParameterProps> = ({
  updateName,
  remove,
  parameter,
  updateParameter,
  isNested
}) => {
  const isItem = parameter.type === ParameterType.Items;
  const className = classnames("HitBuilderParam", {
    "HitBuilderParam--item": isItem
  });

  return (
    <div className={className}>
      {isItem ? (
        <>
          <div className="HitBuilderParam">
            <CustomLabel
              name={parameter.name}
              updateName={updateName}
              remove={remove}
            />

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
                .filter(a => (isNested ? a !== ParameterType.Items : true))
                .map(option => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
            </select>
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
          <CustomLabel
            name={parameter.name}
            updateName={updateName}
            remove={remove}
          />
          <EditParameterValue
            parameter={parameter}
            updateParameter={updateParameter}
          />
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
              .filter(a => (isNested ? a !== ParameterType.Items : true))
              .map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
          </select>
        </>
      )}
    </div>
  );
};

export default EditParameter;
