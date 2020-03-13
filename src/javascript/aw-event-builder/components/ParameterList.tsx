import React from "react";
import IconButton from "../../components/icon-button";
import EditParameter from "./EditParameter";
import { Parameter, Parameters } from "../types";

interface ParameterListProps {
  indentation?: number;
  parameters: Parameter[];
  updateParameters: (update: (old: Parameters) => Parameters) => void;
  addParameter: () => void;
  isNested: boolean;
}

const Parameters: React.FC<ParameterListProps> = ({
  indentation,
  parameters,
  updateParameters,
  addParameter,
  children,
  isNested
}) => {
  const updateParameter = React.useCallback(
    (parameter: Parameter) => (nu: Parameter) => {
      updateParameters(old =>
        old.map(p => (p.name === parameter.name ? nu : p))
      );
    },
    [updateParameters]
  );

  const updateName = React.useCallback(
    (oldName: string, nuName: string) => {
      updateParameters(old =>
        old.map(p => (p.name === oldName ? { ...p, name: nuName } : p))
      );
    },
    [updateParameters]
  );

  const remove = React.useCallback(
    (parameter: Parameter) => () => {
      updateParameters(old => old.filter(p => p.name !== parameter.name));
    },
    [updateParameters, addParameter]
  );

  return (
    <div className={`ParameterList indent-${indentation}`}>
      {parameters.map(parameter => (
        <EditParameter
          remove={remove(parameter)}
          updateName={updateName}
          isNested={isNested}
          key={parameter.name}
          parameter={parameter}
          updateParameter={updateParameter(parameter)}
        />
      ))}
      <div className="HitBuilderParam buttons">
        <IconButton
          type="add-circle"
          iconStyle={{ color: "hsl(150,60%,40%)" }}
          onClick={addParameter}
        >
          Parameter
        </IconButton>
        {children}
      </div>
    </div>
  );
};

export default Parameters;
