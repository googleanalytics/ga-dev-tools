import { ThunkAction } from "redux-thunk";
import {
  HitStatus,
  HitAction,
  ActionType,
  Property,
  State,
  ValidationMessage,
  MPEvent
} from "./types";
import accountSummaries from "javascript-api-utils/lib/account-summaries";

type ThunkResult<T> = ThunkAction<T, State, undefined, HitAction>;

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
const resetHitValidationStatus: ThunkResult<void> = dispatch => {
  dispatch(actions.setHitStatus(HitStatus.Unvalidated));
  dispatch(actions.setValidationMessages([]));
};

const addParam: ThunkResult<void> = dispatch => {
  dispatch({ type: ActionType.AddParam });
  dispatch(thunkActions.resetHitValidationStatus);
};
const removeParam: (id: number) => ThunkResult<void> = (id: number) => {
  return dispatch => {
    dispatch({ type: ActionType.RemoveParam, id });
    dispatch(thunkActions.resetHitValidationStatus);
  };
};
const editParamName: (id: number, name: string) => ThunkResult<void> = (
  id,
  name
) => {
  return dispatch => {
    dispatch({ type: ActionType.EditParamName, id, name });
    dispatch(thunkActions.resetHitValidationStatus);
  };
};
const editParamValue: (id: number, value: string) => ThunkResult<void> = (
  id,
  value
) => {
  return dispatch => {
    dispatch({ type: ActionType.EditParamValue, id, value });
    dispatch(thunkActions.resetHitValidationStatus);
  };
};

const actions = {
  setMid(mid: string): HitAction {
    return { type: ActionType.SetMid, mid };
  },
  setClientId(client_id: string): HitAction {
    return { type: ActionType.SetClientId, client_id };
  },
  setUserId(user_id: string): HitAction {
    return { type: ActionType.SetUserId, user_id };
  },
  setAPISecret(apiSecret: string): HitAction {
    return { type: ActionType.SetAPISecret, apiSecret };
  },
  setEvent(event: MPEvent): HitAction {
    return { type: ActionType.SetEvent, event };
  },
  setHitPayload(hitPayload: string): HitAction {
    return { type: ActionType.SetHitPayload, hitPayload };
  },
  setAuthorized(): HitAction {
    return { type: ActionType.SetAuthorized };
  },
  setUserProperties(properties: Property[]): HitAction {
    return { type: ActionType.SetUserProperties, properties };
  },
  setHitStatus(status: HitStatus): HitAction {
    return { type: ActionType.SetHitStatus, status };
  },
  setValidationMessages(validationMessages: ValidationMessage[]): HitAction {
    return { type: ActionType.SetValidationMessages, validationMessages };
  }
};

const thunkActions = {
  handleAuthorizationSuccess,
  resetHitValidationStatus,
  editParamValue,
  editParamName,
  removeParam,
  addParam
};

export default { ...thunkActions, ...actions };
