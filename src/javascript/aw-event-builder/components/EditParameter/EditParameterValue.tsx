import React from "react";
import { Parameter, ParameterType } from "../../types";

import EditItemsParameter from "./EditItemsParameter";
import EditOptionalStringParameter from "./EditOptionalStringParameter";
import EditOptionalNumberParameter from "./EditOptionalNumberParameter";

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
    case ParameterType.OptionalNumber:
      return (
        <EditOptionalNumberParameter
          parameter={parameter}
          updateParameter={updateParameter}
        />
      );
  }
};

export default EditParameterValue;
