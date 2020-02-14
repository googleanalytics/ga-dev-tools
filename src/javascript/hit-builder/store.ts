import {
  createStore,
  applyMiddleware,
  Reducer,
  Middleware,
  combineReducers,
  Dispatch
} from "redux";
import thunkMuddliware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import {
  HitStatus,
  HitAction,
  ActionType,
  Param,
  Params,
  Property,
  State,
  ValidationMessage,
  ParamOptional
} from "./types";
import accountSummaries from "javascript-api-utils/lib/account-summaries";
import * as hitUtils from "./hit";
import { gaAll } from "../analytics";

import AlertDispatcher from "../components/alert-dispatcher";

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

export const thunkActions = { handleAuthorizationSuccess };

export const actions = {
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
  },
  resetHitValidationStatus(dispatch: Dispatch<HitAction>) {
    dispatch(actions.setHitStatus(HitStatus.Unvalidated));
    dispatch(actions.setValidationMessages([]));
  },
  addParam() {
    return (dispatch: Dispatch<HitAction>) => {
      dispatch({ type: ActionType.AddParam });
      actions.resetHitValidationStatus(dispatch);
    };
  },
  removeParam(id: number) {
    return (dispatch: Dispatch<HitAction>) => {
      dispatch({ type: ActionType.RemoveParam, id });
      actions.resetHitValidationStatus(dispatch);
    };
  },
  editParamName(id: number, name: string) {
    return (dispatch: Dispatch<HitAction>) => {
      dispatch({ type: ActionType.EditParamName, id, name });
      actions.resetHitValidationStatus(dispatch);
    };
  },
  editParamValue(id: number, value: string) {
    return (dispatch: Dispatch<HitAction>) => {
      dispatch({ type: ActionType.EditParamValue, id, value });
      actions.resetHitValidationStatus(dispatch);
    };
  },
  updateHit(newHit: string) {
    return (dispatch: Dispatch<HitAction>, getState: () => State) => {
      const oldHit = hitUtils.convertParamsToHit(getState().params);
      if (oldHit != newHit) {
        const params = hitUtils.convertHitToParams(newHit);
        dispatch({ type: ActionType.ReplaceParams, params });
        actions.resetHitValidationStatus(dispatch);
      }
    };
  },
  validateHit() {
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
    return async (dispatch: Dispatch<HitAction>, getState: () => State) => {
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
        actions.resetHitValidationStatus(dispatch);
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
  }
};

const middleware: Middleware[] = [thunkMuddliware];
// Adds a logger in non-production mode.
if (process.env.NODE_ENV != "production") {
  // Uses `require` here instead of `import` so the module isn't included
  // in the production build.
  const { createLogger } = require("redux-logger");
  middleware.push(createLogger());
}

const hitStatus: Reducer<HitStatus, HitAction> = (
  state: HitStatus = HitStatus.Unvalidated,
  action: HitAction
) => {
  switch (action.type) {
    case ActionType.SetHitStatus:
      return action.status;
    default:
      return state;
  }
};

const isAuthorized: Reducer<boolean, HitAction> = (
  state: boolean = false,
  action: HitAction
) => {
  switch (action.type) {
    case ActionType.SetAuthorized:
      return true;
    default:
      return state;
  }
};

const params: Reducer<Params, HitAction> = (
  state: Params = hitUtils.convertHitToParams(
    hitUtils.getInitialHitAndUpdateUrl()
  ),
  action: HitAction
) => {
  const [v, t, tid, cid, ...others] = state;
  switch (action.type) {
    case ActionType.AddParam: {
      const nextId =
        state.reduce(
          (max: number, param: Param) => Math.max(param.id, max),
          -1
        ) + 1;
      const newParam: ParamOptional = {
        id: nextId,
        name: "",
        value: ""
      };
      return [v, t, tid, cid, ...others.concat([newParam])];
    }
    case ActionType.RemoveParam:
      return [
        v,
        t,
        tid,
        cid,
        ...others.filter(param => param.id !== action.id)
      ];
    case ActionType.EditParamName:
      return [
        v,
        t,
        tid,
        cid,
        ...others.map(param =>
          param.id === action.id ? { ...param, name: action.name } : param
        )
      ];
    case ActionType.EditParamValue:
      // TODO - I wish the typesystem was a bit smarter here, but alas.
      const newParams: Params = state.map(param =>
        action.id === param.id ? { ...param, value: action.value } : param
      ) as Params;
      return newParams;
    case ActionType.ReplaceParams:
      return action.params;

    default:
      return state;
  }
};

const properties: Reducer<Property[], HitAction> = (
  state: Property[] = [],
  action: HitAction
) => {
  switch (action.type) {
    case ActionType.SetUserProperties:
      return action.properties;
    default:
      return state;
  }
};

const validationMessages: Reducer<ValidationMessage[], HitAction> = (
  state: ValidationMessage[] = [],
  action: HitAction
) => {
  switch (action.type) {
    case ActionType.SetValidationMessages:
      return action.validationMessages;
    default:
      return state;
  }
};

const app: Reducer<State, HitAction> = combineReducers({
  hitStatus,
  isAuthorized,
  params,
  properties,
  validationMessages
});

const createStoreWithMiddleware = applyMiddleware<
  ThunkDispatch<State, undefined, HitAction>,
  State
>(...middleware)(createStore);

export default createStoreWithMiddleware<State, HitAction>(app);
