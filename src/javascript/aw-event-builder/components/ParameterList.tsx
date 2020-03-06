import React from "react";
import IconButton from "../../components/icon-button";
import EditParameter from "./EditParameter";
import { Parameter, Parameters } from "../types";

interface ParameterListProps {
  parameters: Parameter[];
  customParameters: Parameter[];
  updateParameters: (update: (old: Parameters) => Parameters) => void;
  updateCustomParameters: (update: (old: Parameters) => Parameters) => void;
  addCustomParameter: () => void;
  showAdd?: true | undefined;
}

const Parameters: React.FC<ParameterListProps> = ({
  showAdd,
  parameters,
  customParameters,
  updateParameters,
  updateCustomParameters,
  addCustomParameter
}) => {
  const updateParameter = React.useCallback(
    (parameter: Parameter) => (nu: Parameter) => {
      updateParameters(old => ({ ...old, [parameter.name]: nu }));
    },
    [updateParameters]
  );
  const updateCustomParameter = React.useCallback(
    (parameter: Parameter) => (nu: Parameter) => {
      updateCustomParameters(old => ({ ...old, [parameter.name]: nu }));
    },
    [updateCustomParameters]
  );

  const custom = React.useCallback(
    (parameter: Parameter) => ({
      updateName: (old: string, nu: string) => {
        updateCustomParameters(oldParameters => {
          const nuParameters = { ...oldParameters };
          const nuValue = nuParameters[old];
          delete nuParameters[old];
          nuValue.name = nu;
          nuParameters[nu] = nuValue;
          return nuParameters;
        });
      },
      remove: () => {
        updateCustomParameters(oldParameters => {
          const nuParameters = { ...oldParameters };
          delete nuParameters[parameter.name];
          return nuParameters;
        });
      }
    }),
    [updateCustomParameters, customParameters, addCustomParameter]
  );

  return (
    <div className="ParameterList">
      {parameters.map(parameter => (
        <EditParameter
          key={parameter.name}
          parameter={parameter}
          updateParameter={updateParameter(parameter)}
        />
      ))}
      {customParameters.length > 0 && (
        <>
          <h4>Custom Parameters</h4>
          {customParameters.map(parameter => (
            <EditParameter
              custom={custom(parameter)}
              key={parameter.name}
              parameter={parameter}
              updateParameter={updateCustomParameter(parameter)}
            />
          ))}
        </>
      )}

      {showAdd && (
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
      )}
    </div>
  );
};

export default Parameters;
