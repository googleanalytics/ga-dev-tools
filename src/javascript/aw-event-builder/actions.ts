import { ThunkAction } from "redux-thunk";
import {
  EventBuilderAction,
  ActionType,
  Property,
  State,
  ValidationMessage,
  MPEvent,
  ValidationStatus
} from "./types";
import * as api from "./event";
import accountSummaries from "javascript-api-utils/lib/account-summaries";

type ThunkResult<T> = ThunkAction<T, State, undefined, EventBuilderAction>;

const sendEvent: ThunkResult<void> = async (dispatch, getState) => {
  const { mid, auth_key, event, user_id, client_id } = getState();

  let userOrClientId: api.UserOrClientId;
  if (user_id !== "") {
    userOrClientId = { user_id };
  } else if (client_id !== "") {
    userOrClientId = { client_id };
  } else {
    userOrClientId = {};
  }

  await api.sendEvent(mid, auth_key, userOrClientId, [event]);
};

const validateEvent: ThunkResult<void> = async (dispatch, getState) => {
  dispatch(actions.setValidationStatus(ValidationStatus.Pending));

  const { mid, auth_key, event, user_id, client_id } = getState();

  let userOrClientId: api.UserOrClientId;
  if (user_id !== "") {
    userOrClientId = { user_id };
  } else if (client_id !== "") {
    userOrClientId = { client_id };
  } else {
    userOrClientId = {};
  }

  const messages = await api.validateHit(mid, auth_key, userOrClientId, [
    event
  ]);
  if (messages.length === 0) {
    dispatch(actions.setValidationStatus(ValidationStatus.Valid));
  } else {
    dispatch(actions.setValidationStatus(ValidationStatus.Invalid));
    dispatch(actions.setValidationMessages(messages));
  }
};

const handleAuthorizationSuccess: ThunkResult<void> = async dispatch => {
  dispatch(actions.setAuthorized());

  const summaries = await accountSummaries.get();
  const properties = summaries.allProperties().map(property => ({
    name: property.name,
    id: property.id,
    group: summaries.getAccountByPropertyId(property.id).name
  }));

  dispatch(actions.setUserProperties(properties));
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
const setMid: (mid: string) => ThunkResult<void> = mid => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetMid, mid });
};
const setClientId: (
  client_id: string
) => ThunkResult<void> = client_id => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetClientId, client_id });
};
const setUserId: (
  user_id: string
) => ThunkResult<void> = user_id => dispatch => {
  dispatch(thunkActions.resetValidation);
  dispatch({ type: ActionType.SetUserId, user_id });
};

const actions = {
  setValidationStatus(validationStatus: ValidationStatus): EventBuilderAction {
    return { type: ActionType.SetValidationStatus, validationStatus };
  },
  setAuthKey(auth_key: string): EventBuilderAction {
    return { type: ActionType.SetAuthKey, auth_key };
  },
  setAuthorized(): EventBuilderAction {
    return { type: ActionType.SetAuthorized };
  },
  setUserProperties(properties: Property[]): EventBuilderAction {
    return { type: ActionType.SetUserProperties, properties };
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
  setMid,
  setClientId,
  setUserId,
  setEvent,
  handleAuthorizationSuccess,
  editParamValue,
  editParamName,
  removeParam,
  addParam,
  validateEvent
};

export default { ...thunkActions, ...actions };
