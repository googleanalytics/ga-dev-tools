import React from "react";
import IconButton from "../../components/icon-button";
import EditParameter from "./EditParameter";

import { makeStyles } from "@material-ui/core/styles";
import { Parameters, defaultStringParam, Parameter, State } from "../types";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";

const useStyles = makeStyles({
  addUserProperty: {
    display: "flex",
    "justify-content": "flex-end"
  }
});

interface EditUserPropertiesProps {}

const EditUserProperties: React.FC<EditUserPropertiesProps> = () => {
  const classes = useStyles();
  const userProperties = useSelector<State, Parameters>(a => a.userProperties);
  const dispatch = useDispatch();
  const setUserProperties = React.useCallback(
    (cb: (old: Parameters) => Parameters) => {
      dispatch(actions.setUserProperties(cb(userProperties)));
    },
    [userProperties, dispatch]
  );

  const addProperty = React.useCallback(() => {
    setUserProperties(old => old.concat([defaultStringParam("", true)]));
  }, [setUserProperties]);

  const updatePropertyName = React.useCallback(
    (idx: number) => (_oldName: string, nuName: string) => {
      setUserProperties(old =>
        old.map((property, i) =>
          idx === i ? { ...property, name: nuName } : property
        )
      );
    },
    [setUserProperties]
  );
  const removeProperty = React.useCallback(
    (idx: number) => () => {
      setUserProperties(old => old.filter((_, i) => i !== idx));
    },
    [setUserProperties]
  );
  const updateProperty = React.useCallback(
    (idx: number) => (nu: Parameter) => {
      setUserProperties(old =>
        old.map((current, i) => (i === idx ? nu : current))
      );
    },
    [setUserProperties]
  );
  return (
    <>
      <h3>User Properties</h3>
      {userProperties.length === 0 ? (
        <div>
          <p>No user properties configured.</p>
          <div className={classes.addUserProperty}>
            <IconButton
              type="add-circle"
              iconStyle={{ color: "hsl(150,60%,40%)" }}
              onClick={addProperty}
            >
              User Property
            </IconButton>
          </div>
        </div>
      ) : (
        <>
          <div>
            {userProperties.map((property, idx) => (
              <EditParameter
                key={`userProperty-${idx}`}
                updateParameter={updateProperty(idx)}
                isNested={false}
                parameter={property}
                updateName={updatePropertyName(idx)}
                remove={removeProperty(idx)}
              />
            ))}
          </div>
          <div className={classes.addUserProperty}>
            <IconButton
              type="add-circle"
              iconStyle={{ color: "hsl(150,60%,40%)" }}
              onClick={addProperty}
            >
              User Property
            </IconButton>
          </div>
        </>
      )}
    </>
  );
};
export default EditUserProperties;
