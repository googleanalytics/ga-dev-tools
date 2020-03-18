import { gaAll } from "../analytics";
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
    try {
      const decoded = atob(eventDataString);
      console.log(decoded);
      const eventData = JSON.parse(decoded) as MPEventData;
      const eventType = MPEvent.eventTypeFromString(eventData.type as string);
      if (eventType !== undefined) {
        let emptyEvent = MPEvent.empty(eventType);
        const parameters = eventData.parameters;
        if (parameters !== undefined) {
          emptyEvent = emptyEvent.updateParameters(() => parameters);
        }
        gaAll("send", "event", {
          eventCategory: "App+Web Event Builder",
          eventAction: "hydrate",
          eventLabel: "event-from-url"
        });
        return emptyEvent;
      }
    } catch (e) {
      console.log(e);
      // ignore
    }
  } else if (searchParams.has("eventType")) {
    const eventType = MPEvent.eventTypeFromString(
      searchParams.get("eventType")!
    );
    if (eventType !== undefined) {
      return MPEvent.empty(eventType);
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

const api_secret: Reducer<string, EventBuilderAction> = (
  state = "",
  action
) => {
  switch (action.type) {
    case ActionType.SetAuthKey:
      return action.api_secret;
    default:
      return state;
  }
};

const clientId: Reducer<string, EventBuilderAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetClientId:
      return action.clientId;
    default:
      return state;
  }
};

const userId: Reducer<string, EventBuilderAction> = (state = "", action) => {
  switch (action.type) {
    case ActionType.SetUserId:
      return action.userId;
    default:
      return state;
  }
};

const measurement_id: Reducer<string, EventBuilderAction> = (
  state = "",
  action
) => {
  switch (action.type) {
    case ActionType.SetMeasurementId:
      return action.measurement_id;
    default:
      return state;
  }
};

const firebase_app_id: Reducer<string, EventBuilderAction> = (
  state = "",
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
  measurement_id,
  firebase_app_id,
  userId,
  clientId,
  api_secret,
  event,
  isAuthorized,
  validationMessages
});

const createStoreWithMiddleware = applyMiddleware<
  ThunkDispatch<State, undefined, EventBuilderAction>,
  State
>(...middleware)(createStore);

export default createStoreWithMiddleware<State, EventBuilderAction>(app);
