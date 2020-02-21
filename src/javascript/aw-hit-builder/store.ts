import {
  createStore,
  applyMiddleware,
  Reducer,
  Middleware,
  combineReducers
} from "redux";
import thunkMuddliware, { ThunkDispatch } from "redux-thunk";
import {
  MPEvent,
  HitStatus,
  HitAction,
  ActionType,
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

const event: Reducer<MPEvent, HitAction> = (
  state = MPEvent.default(),
  action
) => {
  switch (action.type) {
    case ActionType.SetEvent:
      return action.event;
    default:
      return state;
  }
};

const authKey: Reducer<string, HitAction> = (state = "", action) => {
  switch (action.type) {
    default:
      return state;
  }
};
const mid: Reducer<string, HitAction> = (state = "", action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const app: Reducer<State, HitAction> = combineReducers({
  authKey,
  mid,
  event,
  hitStatus,
  isAuthorized,
  properties,
  validationMessages
});

const createStoreWithMiddleware = applyMiddleware<
  ThunkDispatch<State, undefined, HitAction>,
  State
>(...middleware)(createStore);

export default createStoreWithMiddleware<State, HitAction>(app);
