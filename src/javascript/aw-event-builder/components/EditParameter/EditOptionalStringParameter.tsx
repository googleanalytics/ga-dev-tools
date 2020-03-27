import React from "react";
import { StringParam } from "../../types";

interface EditOptionalStringParameterProps {
  parameter: StringParam;
  updateParameter: (nu: StringParam) => void;
}

const EditOptionalStringParameter: React.FC<
  EditOptionalStringParameterProps
> = ({ parameter, updateParameter }) => {
  const [localValue, setLocalValue] = React.useState(parameter.value);

  const updateWithLocalParameter = React.useCallback(() => {
    if (localValue !== parameter.value) {
      updateParameter({ ...parameter, value: localValue });
    }
  }, [localValue]);

  return (
    <>
      <input
        className="FormField"
        value={localValue}
        onChange={e => {
          setLocalValue(e.target.value);
        }}
        onBlur={updateWithLocalParameter}
      />
    </>
  );
};

export default EditOptionalStringParameter;
