import {
  createStore,
  applyMiddleware,
  Reducer,
  Middleware,
  combineReducers
} from "redux";
import thunkMuddliware, { ThunkDispatch } from "redux-thunk";
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
import * as hitUtils from "./hit";

const middleware: Middleware[] = [thunkMuddliware];
// Adds a logger in non-production mode.
if (process.env.NODE_ENV != "production") {
  // Uses `require` here instead of `import` so the module isn't included
  // in the production build.
  const { createLogger } = require("redux-logger");
  middleware.push(createLogger());
}

const hitStatus: Reducer<HitStatus, HitAction> = (
  state = HitStatus.Unvalidated,
  action
) => {
  switch (action.type) {
    case ActionType.SetHitStatus:
      return action.status;
    default:
      return state;
  }
};

const isAuthorized: Reducer<boolean, HitAction> = (state = false, action) => {
  switch (action.type) {
    case ActionType.SetAuthorized:
      return true;
    default:
      return state;
  }
};

const params: Reducer<Params, HitAction> = (
  state = hitUtils.convertHitToParams(hitUtils.getInitialHitAndUpdateUrl()),
  action
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

const properties: Reducer<Property[], HitAction> = (state = [], action) => {
  switch (action.type) {
    case ActionType.SetUserProperties:
      return action.properties;
    default:
      return state;
  }
};

const validationMessages: Reducer<ValidationMessage[], HitAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case ActionType.SetValidationMessages:
      return action.validationMessages;
    default:
      return state;
  }
};

const hitPayload: Reducer<string, HitAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetHitPayload:
      return action.hitPayload;
    default:
      return state;
  }
};

const app: Reducer<State, HitAction> = combineReducers({
  hitPayload,
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
