import React from "react";
import actions from "../actions";
import { useDispatch } from "react-redux";

const APISecret: React.FC = () => {
  const [localSecret, setLocalSecret] = React.useState("");
  const dispatch = useDispatch();
  const setSecret = React.useCallback(() => {
    dispatch(actions.setAPISecret(localSecret));
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
