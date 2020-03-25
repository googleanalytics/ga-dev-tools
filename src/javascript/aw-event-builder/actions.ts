import { ThunkAction } from "redux-thunk";
import {
  EventBuilderAction,
  ActionType,
  State,
  ValidationMessage,
  MPEvent,
  ValidationStatus
} from "./types";
import * as api from "./event";

type ThunkResult<T> = ThunkAction<T, State, undefined, EventBuilderAction>;

const sendEvent: ThunkResult<void> = async (_, getState) => {
  const {
    measurementId,
    firebaseAppId,
    apiSecret,
    event,
    userId,
    clientId
  } = getState();

  const userOrClientId: api.UserOrClientId = { userId, clientId };
  const instanceId = { measurementId, firebaseAppId };

  await api.sendEvent(instanceId, apiSecret, userOrClientId, [event]);
};

const validateEvent: ThunkResult<void> = async (dispatch, getState) => {
  dispatch(actions.setValidationStatus(ValidationStatus.Pending));

  const {
    measurementId,
    firebaseAppId,
    apiSecret,
    event,
    userId,
    clientId
  } = getState();

  const userOrClientId: api.UserOrClientId = { userId, clientId };
  const instanceId = { measurementId, firebaseAppId };

  const messages = await api.validateHit(
    instanceId,
    apiSecret,
    userOrClientId,
    [event]
  );
  if (messages.length === 0) {
    dispatch(actions.setValidationStatus(ValidationStatus.Valid));
  } else {
    dispatch(actions.setValidationStatus(ValidationStatus.Invalid));
    dispatch(actions.setValidationMessages(messages));
  }
};

const resetValidation: ThunkResult<void> = dispatch => {
  dispatch(actions.setValidationMessages([]));
  dispatch(actions.setValidationStatus(ValidationStatus.Unset));
};

const addParam: ThunkResult<void> = dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.AddParam });
};
const removeParam: (id: number) => ThunkResult<void> = (id: number) => {
  return dispatch => {
    dispatch(thunkActions.resetValidation);
    dispatch({ type: ActionType.RemoveParam, id });
  };
};
const editParamName: (id: number, name: string) => ThunkResult<void> = (
  id,
  name
) => {
  return dispatch => {
    dispatch(thunkActions.resetValidation);
    dispatch({ type: ActionType.EditParamName, id, name });
  };
};
const editParamValue: (id: number, value: string) => ThunkResult<void> = (
  id,
  value
) => {
  return dispatch => {
    dispatch(thunkActions.resetValidation);
    dispatch({ type: ActionType.EditParamValue, id, value });
  };
};

const setEvent: (event: MPEvent) => ThunkResult<void> = (
  event: MPEvent
) => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetEvent, event });
};
const setMeasurementId: (
  measurement_id: string
) => ThunkResult<void> = measurement_id => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetMeasurementId, measurement_id });
};
const setFirebaseAppId: (
  firebase_app_id: string
) => ThunkResult<void> = firebase_app_id => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetFirebaseAppId, firebase_app_id });
};
const setClientId: (
  clientId: string
) => ThunkResult<void> = clientId => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetClientId, clientId });
};
const setUserId: (userId: string) => ThunkResult<void> = userId => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetUserId, userId });
};

const actions = {
  setValidationStatus(validationStatus: ValidationStatus): EventBuilderAction {
    return { type: ActionType.SetValidationStatus, validationStatus };
  },
  setAPISecret(api_secret: string): EventBuilderAction {
    return { type: ActionType.SetAuthKey, api_secret };
  },
  setAuthorized(): EventBuilderAction {
    return { type: ActionType.SetAuthorized };
  },
  setValidationMessages(
    validationMessages: ValidationMessage[]
  ): EventBuilderAction {
    return { type: ActionType.SetValidationMessages, validationMessages };
  }
};

const thunkActions = {
  sendEvent,
  resetValidation,
  setMeasurementId,
  setFirebaseAppId,
  setClientId,
  setUserId,
  setEvent,
  editParamValue,
  editParamName,
  removeParam,
  addParam,
  validateEvent
};

export default { ...thunkActions, ...actions };
