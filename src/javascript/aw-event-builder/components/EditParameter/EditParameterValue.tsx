import React from "react";
import { Parameter, ParameterType } from "../../types";

import EditItemsParameter from "./EditItemsParameter";
import EditOptionalStringParameter from "./EditOptionalStringParameter";

interface EditParameterValueProps {
  parameter: Parameter;
  updateParameter: (nu: Parameter) => void;
}

const EditParameterValue: React.FC<EditParameterValueProps> = ({
  parameter,
  updateParameter
}) => {
  switch (parameter.type) {
    case ParameterType.OptionalString:
      return (
        <EditOptionalStringParameter
          parameter={parameter}
          updateParameter={updateParameter}
        />
      );
    case ParameterType.RequiredArray:
      return (
        <EditItemsParameter
          items={parameter}
          updateParameter={updateParameter}
        />
      );
  }
};

export default EditParameterValue;
