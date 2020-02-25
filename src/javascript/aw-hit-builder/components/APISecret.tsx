import React from "react";
import actions from "../actions";
import { useDispatch } from "react-redux";

const APISecret: React.FC = () => {
  const [localSecret, setLocalSecret] = React.useState("");
  // Initalize
  React.useEffect(() => {
    const search = window.location.search;
    const fromSearch = new URLSearchParams(search);
    if (fromSearch.has("api_secret")) {
      setLocalSecret(fromSearch.get("api_secret")!);
      dispatch(actions.setAPISecret(fromSearch.get("api_secret")!));
    } else {
      const fromLocalStorage = localStorage.getItem("ga-dev-tools/api_secret");
      if (fromLocalStorage !== null) {
        setLocalSecret(fromLocalStorage);
        dispatch(actions.setAPISecret(fromLocalStorage));
      }
    }
  }, []);
  const dispatch = useDispatch();
  const setSecret = React.useCallback(() => {
    dispatch(actions.setAPISecret(localSecret));
    localStorage.setItem("ga-dev-tools/api_secret", localSecret);
  }, [localSecret, dispatch]);
  return (
    <div className="HitBuilderParam">
      <label className="HitBuilderParam-label">API Secret</label>
      <input
        className="FormField"
        value={localSecret}
        onChange={e => setLocalSecret(e.target.value)}
        onBlur={setSecret}
      />
    </div>
  );
};

export default APISecret;
