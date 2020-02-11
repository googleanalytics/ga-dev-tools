import {
  createStore,
  applyMiddleware,
  Reducer,
  Middleware,
  combineReducers,
  Dispatch
} from "redux";
import thunkMuddliware from "redux-thunk";
import {
  HitStatus,
  HitAction,
  ActionType,
  Param,
  Property,
  State,
  ValidationMessage
} from "./types";
import accountSummaries from "javascript-api-utils/lib/account-summaries";

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
  handleAuthorizationSuccess(): (
    dispatch: Dispatch<HitAction>
  ) => Promise<void> {
    return async (dispatch: Dispatch<HitAction>) => {
      dispatch(actions.setAuthorized());

      const summaries = await accountSummaries.get();
      const properties = summaries.allProperties().map(property => ({
        name: property.name,
        id: property.id,
        group: summaries.getAccountByPropertyId(property.id).name
      }));

      dispatch(actions.setUserProperties(properties));
    };
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

const params: Reducer<Param[], HitAction> = (
  state: Param[] = [],
  action: HitAction
) => {
  switch (action.type) {
    case ActionType.AddParam: {
      const nextId =
        state.reduce(
          (max: number, param: Param) => Math.max(param.id, max),
          -1
        ) + 1;
      const newParam: Param = {
        id: nextId,
        name: "",
        value: ""
      };
      return [...state, newParam];
    }
    case ActionType.RemoveParam:
      return state.filter(param => param.id !== action.id);
    case ActionType.EditParamName:
      return state.map(param =>
        param.id === action.id ? { ...param, name: action.name } : param
      );
    case ActionType.EditParamValue:
      return state.map(param =>
        param.id === action.id ? { ...param, value: action.value } : param
      );
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

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default createStoreWithMiddleware<State, HitAction>(app);
