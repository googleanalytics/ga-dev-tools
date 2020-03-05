import React from "react";
import actions from "../actions";
import { useDispatch } from "react-redux";

const AuthKey: React.FC = () => {
  const [localKey, setLocalKey] = React.useState("");
  // Initalize
  React.useEffect(() => {
    const search = window.location.search;
    const fromSearch = new URLSearchParams(search);
    if (fromSearch.has("auth_key")) {
      setLocalKey(fromSearch.get("auth_key")!);
      dispatch(actions.setAuthKey(fromSearch.get("auth_key")!));
    } else {
      const fromLocalStorage = localStorage.getItem("ga-dev-tools/auth_key");
      if (fromLocalStorage !== null) {
        setLocalKey(fromLocalStorage);
        dispatch(actions.setAuthKey(fromLocalStorage));
      }
    }
  }, []);
  const dispatch = useDispatch();
  const setSecret = React.useCallback(() => {
    dispatch(actions.setAuthKey(localKey));
    localStorage.setItem("ga-dev-tools/auth_key", localKey);
  }, [localKey, dispatch]);
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label">Auth key</label>
      <input
        className="FormField"
        value={localKey}
        onChange={e => setLocalKey(e.target.value)}
        onBlur={setSecret}
      />
    </div>
  );
};

export default AuthKey;
