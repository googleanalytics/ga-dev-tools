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
  Property,
  State,
  ValidationMessage,
  MPEventData,
  ValidationStatus
} from "./types";

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

const properties: Reducer<Property[], EventBuilderAction> = (
  state = [],
  action
) => {
  switch (action.type) {
    case ActionType.SetUserProperties:
      return action.properties;
    default:
      return state;
  }
};

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

const getInitialEvent = () => {
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  if (searchParams.has("eventData")) {
    const eventDataString = searchParams.get("eventData")!;
    const decoded = decodeURIComponent(eventDataString);
    try {
      const eventData = JSON.parse(decoded) as MPEventData;
      const eventType = MPEvent.eventTypeFromString(eventData.type as string);
      if (eventType !== undefined) {
        console.log("here", { eventData, eventType });
        let emptyEvent = MPEvent.empty(eventType);
        const parameters = eventData.parameters;
        if (parameters !== undefined) {
          emptyEvent = emptyEvent.updateParameters(() => parameters);
        }
        const customParameters = eventData.customParameters;
        if (customParameters !== undefined) {
          emptyEvent = emptyEvent.updateCustomParameters(
            () => customParameters
          );
        }
        return emptyEvent;
      }
    } catch (e) {
      console.log(e);
      // ignore
    }
  }
  return MPEvent.default();
};

const event: Reducer<MPEvent, EventBuilderAction> = (
  state = getInitialEvent(),
  action
) => {
  switch (action.type) {
    case ActionType.SetEvent:
      return action.event;
    default:
      return state;
  }
};

const auth_key: Reducer<string, EventBuilderAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetAuthKey:
      return action.auth_key;
    default:
      return state;
  }
};

const client_id: Reducer<string, EventBuilderAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetClientId:
      return action.client_id;
    default:
      return state;
  }
};

const user_id: Reducer<string, EventBuilderAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetUserId:
      return action.user_id;
    default:
      return state;
  }
};

const mid: Reducer<string, EventBuilderAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetMid:
      return action.mid;
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
  mid,
  user_id,
  client_id,
  auth_key,
  event,
  isAuthorized,
  properties,
  validationMessages
});

const createStoreWithMiddleware = applyMiddleware<
  ThunkDispatch<State, undefined, EventBuilderAction>,
  State
>(...middleware)(createStore);

export default createStoreWithMiddleware<State, EventBuilderAction>(app);
