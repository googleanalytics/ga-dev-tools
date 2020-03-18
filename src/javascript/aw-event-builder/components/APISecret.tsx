import React from "react";
import actions from "../actions";
import { useDispatch } from "react-redux";

const APISecret: React.FC = () => {
  const [localValue, setLocalValue] = React.useState("");
  // Initalize
  React.useEffect(() => {
    const search = window.location.search;
    const fromSearch = new URLSearchParams(search);
    if (fromSearch.has("api_secret")) {
      setLocalValue(fromSearch.get("api_secret")!);
      dispatch(actions.setAPISecret(fromSearch.get("api_secret")!));
    } else {
      const fromLocalStorage = localStorage.getItem("ga-dev-tools/api_secret");
      if (fromLocalStorage !== null) {
        setLocalValue(fromLocalStorage);
        dispatch(actions.setAPISecret(fromLocalStorage));
      }
    }
  }, []);
  const dispatch = useDispatch();
  const setSecret = React.useCallback(() => {
    dispatch(actions.setAPISecret(localValue));
    localStorage.setItem("ga-dev-tools/api_secret", localValue);
  }, [localValue, dispatch]);
  // TODO - look into using the ReduxManagementInput component for this.
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label">API Secret</label>
      <input
        className="FormField"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={setSecret}
      />
    </div>
  );
};

export default APISecret;
