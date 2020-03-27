import React from "react";
import { NumberParam } from "../../types";

interface EditOptionalNumberParameterProps {
  parameter: NumberParam;
  updateParameter: (nu: NumberParam) => void;
}

const EditOptionalNumberParameter: React.FC<
  EditOptionalNumberParameterProps
> = ({ parameter, updateParameter }) => {
  const [localValue, setLocalValue] = React.useState<string>(
    parameter.value === undefined ? "" : parameter.value.toString()
  );

  const updateWithLocalParameter = React.useCallback(() => {
    const parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      setLocalValue("");
      return updateParameter({ ...parameter, value: undefined });
    }
    if (parsed !== parameter.value) {
      return updateParameter({ ...parameter, value: parsed });
    }
  }, [localValue, parameter, updateParameter]);

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

export default EditOptionalNumberParameter;
