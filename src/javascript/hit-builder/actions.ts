import { ThunkAction } from "redux-thunk";
import {
  HitStatus,
  HitAction,
  ActionType,
  Property,
  State,
  ValidationMessage
} from "./types";
import * as hitUtils from "./hit";
import { gaAll } from "../analytics";
import accountSummaries from "javascript-api-utils/lib/account-summaries";
import AlertDispatcher from "../components/alert-dispatcher";

type ThunkResult<T> = ThunkAction<T, State, undefined, HitAction>;

const handleAuthorizationSuccess: ThunkResult<void> = async dispatch => {
  dispatch(thunkActions.updateHitPayload);
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

const updateHitPayload: ThunkResult<void> = (dispatch, getState) => {
  const params = getState().params;
  dispatch(actions.setHitPayload(hitUtils.convertParamsToHit(params)));
};

const addParam: ThunkResult<void> = dispatch => {
  dispatch({ type: ActionType.AddParam });
  dispatch(thunkActions.updateHitPayload);
  dispatch(thunkActions.resetHitValidationStatus);
};
const removeParam: (id: number) => ThunkResult<void> = (id: number) => {
  return dispatch => {
    dispatch({ type: ActionType.RemoveParam, id });
    dispatch(thunkActions.updateHitPayload);
    dispatch(thunkActions.resetHitValidationStatus);
  };
};
const editParamName: (id: number, name: string) => ThunkResult<void> = (
  id,
  name
) => {
  return dispatch => {
    dispatch({ type: ActionType.EditParamName, id, name });
    dispatch(thunkActions.updateHitPayload);
    dispatch(thunkActions.resetHitValidationStatus);
  };
};
const editParamValue: (id: number, value: string) => ThunkResult<void> = (
  id,
  value
) => {
  return dispatch => {
    dispatch({ type: ActionType.EditParamValue, id, value });
    dispatch(thunkActions.updateHitPayload);
    dispatch(thunkActions.resetHitValidationStatus);
  };
};
const updateHit: (newHit: string) => ThunkResult<void> = (newHit: string) => {
  return (dispatch, getState) => {
    const oldHit = hitUtils.convertParamsToHit(getState().params);
    if (oldHit != newHit) {
      const params = hitUtils.convertHitToParams(newHit);
      dispatch({ type: ActionType.ReplaceParams, params });
      dispatch(thunkActions.resetHitValidationStatus);
    }
  };
};

const formatMessage = (message: {
  parameter: any;
  description: string;
  messageType: any;
  messageCode: any;
}) => {
  const linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/;
  return {
    param: message.parameter,
    description: message.description.replace(linkRegex, "").trim(),
    type: message.messageType,
    code: message.messageCode
  };
};

const validateHit: ThunkResult<void> = async (dispatch, getState, third) => {
  const hit = hitUtils.convertParamsToHit(getState().params);
  dispatch(actions.setHitStatus(HitStatus.Validating));

  try {
    const data = await hitUtils.getHitValidationResult(hit);

    // In some cases the query will have changed before the response gets
    // back, so we need to check that the result is for the current query.
    // If it's not, ignore it.
    if (data.hit != hitUtils.convertParamsToHit(getState().params)) {
      return;
    }

    const result = data.response.hitParsingResult[0];
    const validationMessages = result.parserMessage;

    if (result.valid) {
      dispatch(actions.setHitStatus(HitStatus.Valid));
      dispatch(actions.setValidationMessages([]));
      gaAll("send", "event", {
        eventCategory: "Hit Builder",
        eventAction: "validate",
        eventLabel: "valid"
      });
    } else {
      dispatch(actions.setHitStatus(HitStatus.Invalid));
      dispatch(
        actions.setValidationMessages(validationMessages.map(formatMessage))
      );
      gaAll("send", "event", {
        eventCategory: "Hit Builder",
        eventAction: "validate",
        eventLabel: "invalid"
      });
    }
  } catch (err) {
    // TODO(philipwalton): handle timeout errors and slow network connection.
    thunkActions.resetHitValidationStatus(dispatch, getState, third);
    AlertDispatcher.addOnce({
      title: "Oops, an error occurred while validating the hit",
      message: `Check your connection to make sure you're still online.
If you're still having problems, try refreshing the page.`
    });
    gaAll("send", "event", {
      eventCategory: "Hit Builder",
      eventAction: "validate",
      eventLabel: "error"
    });
  }
};

const actions = {
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
  updateHit,
  editParamValue,
  editParamName,
  removeParam,
  addParam,
  validateHit,
  updateHitPayload
};

export default { ...thunkActions, ...actions };
