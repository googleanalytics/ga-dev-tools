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
  EventBuilderAction,
  ActionType,
  State,
  ValidationMessage,
  MPEventData,
  ValidationStatus
} from "./types";
import { unParameterizeUrl } from "./event";

const middleware: Middleware[] = [thunkMuddliware];
// Adds a logger in non-production mode.
if (process.env.NODE_ENV != "production") {
  // Uses `require` here instead of `import` so the module isn't included
  // in the production build.
  const { createLogger } = require("redux-logger");
  middleware.push(createLogger());
}

const isAuthorized: Reducer<boolean, EventBuilderAction> = (
  state = false,
  action
) => {
  switch (action.type) {
    case ActionType.SetAuthorized:
      return true;
    default:
      return state;
  }
};

const valuesFromUrlParameters = unParameterizeUrl();
console.log({ valuesFromUrlParameters });

const validationMessages: Reducer<ValidationMessage[], EventBuilderAction> = (
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

const event: Reducer<MPEvent, EventBuilderAction> = (
  state = valuesFromUrlParameters.event || MPEvent.default(),
  action
) => {
  switch (action.type) {
    case ActionType.SetEvent:
      return action.event;
    default:
      return state;
  }
};

const apiSecret: Reducer<string, EventBuilderAction> = (
  state = valuesFromUrlParameters.apiSecret || "",
  action
) => {
  switch (action.type) {
    case ActionType.SetAuthKey:
      return action.api_secret;
    default:
      return state;
  }
};

const clientId: Reducer<string, EventBuilderAction> = (
  state = valuesFromUrlParameters.clientId || "",
  action
) => {
  switch (action.type) {
    case ActionType.SetClientId:
      return action.clientId;
    default:
      return state;
  }
};

const userId: Reducer<string, EventBuilderAction> = (
  state = valuesFromUrlParameters.userId || "",
  action
) => {
  switch (action.type) {
    case ActionType.SetUserId:
      return action.userId;
    default:
      return state;
  }
};

const measurementId: Reducer<string, EventBuilderAction> = (
  state = valuesFromUrlParameters.measurementId || "",
  action
) => {
  switch (action.type) {
    case ActionType.SetMeasurementId:
      return action.measurement_id;
    default:
      return state;
  }
};

const firebaseAppId: Reducer<string, EventBuilderAction> = (
  state = valuesFromUrlParameters.firebaseAppId || "",
  action
) => {
  switch (action.type) {
    case ActionType.SetFirebaseAppId:
      return action.firebase_app_id;
    default:
      return state;
  }
};

const validationStatus: Reducer<ValidationStatus, EventBuilderAction> = (
  state = ValidationStatus.Unset,
  action
) => {
  switch (action.type) {
    case ActionType.SetValidationStatus:
      return action.validationStatus;
    default:
      return state;
  }
};

const app: Reducer<State, EventBuilderAction> = combineReducers({
  validationStatus,
  measurementId,
  firebaseAppId,
  userId,
  clientId,
  apiSecret,
  event,
  isAuthorized,
  validationMessages
});

const createStoreWithMiddleware = applyMiddleware<
  ThunkDispatch<State, undefined, EventBuilderAction>,
  State
>(...middleware)(createStore);

export default createStoreWithMiddleware<State, EventBuilderAction>(app);
