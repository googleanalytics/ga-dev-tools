import { gaAll } from "../analytics";
import { ValidationMessage, MPEvent, MPEventData, MPEventType } from "./types";

export interface UserOrClientId {
  userId?: string;
  clientId?: string;
}

export interface InstanceId {
  measurementId?: string;
  firebaseAppId?: string;
}

export interface URLParts {
  eventName?: string;
  clientId?: string;
  userId?: string;
  event?: MPEvent;
  measurementId?: string;
  firebaseAppId?: string;
  apiSecret?: string;
}

const getEventFromParams = (searchParams: URLSearchParams) => {
  if (searchParams.has("eventData")) {
    const eventDataString = searchParams.get("eventData")!;
    try {
      const decoded = atob(eventDataString);
      console.log(decoded);
      const eventData = JSON.parse(decoded) as MPEventData;
      const eventType = MPEvent.eventTypeFromString(eventData.type as string);
      if (eventType !== undefined) {
        let emptyEvent = MPEvent.empty(eventType);
        if (eventType === MPEventType.CustomEvent) {
          const eventName = searchParams.get("eventName");
          if (eventName !== null) {
            emptyEvent = emptyEvent.updateName(eventName);
          }
        }
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

export const unParameterizeUrl = (): URLParts => {
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const clientId = searchParams.get("clientId") || undefined;
  const userId = searchParams.get("userId") || undefined;
  const event = getEventFromParams(searchParams);
  const measurementId = searchParams.get("measurementId") || undefined;
  const firebaseAppId = searchParams.get("firebaseAppId") || undefined;
  const apiSecret = searchParams.get("apiSecret") || undefined;
  return {
    clientId,
    userId,
    event,
    measurementId,
    firebaseAppId,
    apiSecret,
    eventName: event.isCustomEvent() ? event.getEventName() : undefined
  };
};

export const parameterizedUrl = ({
  clientId,
  userId,
  event,
  measurementId,
  firebaseAppId,
  apiSecret
}: URLParts) => {
  const params = new URLSearchParams();

  clientId && clientId !== "" && params.append("clientId", clientId);
  userId && userId !== "" && params.append("userId", userId);
  apiSecret && apiSecret !== "" && params.append("apiSecret", apiSecret);
  event &&
    event.getEventType() === MPEventType.CustomEvent &&
    params.append("eventName", event.getEventName());

  measurementId &&
    measurementId !== "" &&
    params.append("measurementId", measurementId);

  firebaseAppId &&
    firebaseAppId !== "" &&
    params.append("firebaseAppId", firebaseAppId);

  // We base64 encode the JSON string to make the url a bit smaller.
  event &&
    params.append("eventData", btoa(JSON.stringify(event.getEventData())));

  const urlParams = params.toString();
  const { protocol, host, pathname } = location;

  return `${protocol}//${host}${pathname}?${urlParams}`;
};

// Build the query param for the instance that should be used for the event.
// Defaults to an empty measurement_id if neither one is set.
const instanceQueryParamFor = (instanceId: InstanceId) => {
  if (instanceId.firebaseAppId !== "") {
    return `firebase_app_id=${instanceId.firebaseAppId}`;
  }
  if (instanceId.measurementId !== "") {
    return `measurement_id=${instanceId.measurementId}`;
  }
  return `measurement_id=`;
};

export const validateHit = async (
  instanceId: InstanceId,
  api_secret: string,
  requiredId: UserOrClientId,
  events: MPEvent[]
): Promise<ValidationMessage[]> => {
  const url = `https://www.google-analytics.com/debug/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`;
  const data = {
    ...requiredId,
    events: events.map(event => event.asPayload()),
    validationBehavior: "ENFORCE_RECOMMENDATIONS"
  };
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  });
  const asJson = await result.json();
  return asJson.validationMessages as ValidationMessage[];
};

export const sendEvent = async (
  instanceId: InstanceId,
  api_secret: string,
  requiredId: UserOrClientId,
  events: MPEvent[]
): Promise<Response> => {
  const url = `https://www.google-analytics.com/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`;
  const data = {
    ...requiredId,
    events: events.map(event => event.asPayload())
  };
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  });
  return result;
};
