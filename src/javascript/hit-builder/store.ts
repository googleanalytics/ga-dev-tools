import {
  createStore,
  applyMiddleware,
  Reducer,
  Middleware,
  combineReducers
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
