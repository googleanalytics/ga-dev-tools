import React from "react";

interface ReduxManagedInputProps {
  flex?: string;
  disabled?: boolean;
  update: (localValue: string) => void;
  labelText: string | JSX.Element;
  initialValue?: string;
}

// TODO - not sure if it matters, but if the value changes in redux, this does not automatically update.
const ReduxManagedInput: React.FC<ReduxManagedInputProps> = ({
  flex,
  update,
  labelText,
  disabled,
  initialValue,
}) => {
  const [localValue, setLocalValue] = React.useState<string>(
    initialValue || ""
  );
  const updateInRedux = React.useCallback(() => {
    update(localValue);
  }, [localValue]);
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label" style={{ flex: flex }}>
        {labelText}
      </label>
      <input
        disabled={disabled}
        className="FormField"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={updateInRedux}
      />
    </div>
  );
};

interface ReduxManagedCheckboxProps {
  flex?: string;
  disabled?: boolean;
  update: (localValue: boolean) => void;
  labelText: string | JSX.Element;
  value: boolean;
}

// TODO - not sure if it matters, but if the value changes in redux, this does not automatically update.
export const ReduxManagedCheckbox: React.FC<ReduxManagedCheckboxProps> = ({
  flex,
  update,
  labelText,
  disabled,
  value,
}) => {
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label" style={{ flex: flex }}>
        {labelText}
      </label>
      <input
        type="checkbox"
        disabled={disabled}
        checked={value}
        onChange={(e) => update(e.target.checked)}
      />
    </div>
  );
};

export default ReduxManagedInput;
