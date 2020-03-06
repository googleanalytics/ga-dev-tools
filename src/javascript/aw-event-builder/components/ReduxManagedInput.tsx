import React from "react";
import actions from "../actions";
import { useDispatch } from "react-redux";

interface ReduxManagedInputProps {
  flex?: string;
  update: (localValue: string) => void;
  labelText: string;
  urlParamName?: string;
}

// TODO - not sure if it matters, but if the value changes in redux, this does not automatically update.
const ReduxManagedInput: React.FC<ReduxManagedInputProps> = ({
  flex,
  update,
  labelText,
  urlParamName
}) => {
  const [localValue, setLocalValue] = React.useState<string>(() => {
    if (urlParamName) {
      const search = window.location.search;
      const searchParams = new URLSearchParams(search);
      if (searchParams.has(urlParamName)) {
        const fromSearch: string = searchParams.get(urlParamName)!;
        update(fromSearch);
        return fromSearch;
      }
    }
    return "";
  });
  const dispatch = useDispatch();
  const updateInRedux = React.useCallback(() => {
    update(localValue);
  }, [localValue, dispatch]);
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label" style={{ flex: flex }}>
        {labelText}
      </label>
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
