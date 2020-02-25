import React from "react";
import actions from "../actions";
import { useDispatch } from "react-redux";

interface ReduxManagedInputProps {
  update: (localValue: string) => void;
  labelText: string;
}

// TODO - not sure if it matters, but if the value changes in redux, this does not automatically update.
const ReduxManagedInput: React.FC<ReduxManagedInputProps> = ({
  update,
  labelText
}) => {
  const [localValue, setLocalValue] = React.useState("");
  const dispatch = useDispatch();
  const updateInRedux = React.useCallback(() => {
    update(localValue);
  }, [localValue, dispatch]);
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label">{labelText}</label>
      <input
        className="FormField"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={updateInRedux}
      />
    </div>
  );
};

export default ReduxManagedInput;
