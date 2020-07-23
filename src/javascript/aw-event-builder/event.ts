import { gaAll } from "../analytics";
import {
  ValidationMessage,
  MPEvent,
  MPEventData,
  MPEventType,
  Parameters,
  UrlParam,
} from "./types";

interface WebIds {
  type: "web";
  clientId?: string;
  userId?: string;
}

interface MobileIds {
  type: "mobile";
  appInstanceId?: string;
  userId?: string;
}

export type ClientIds = WebIds | MobileIds;

export interface InstanceId {
  measurementId?: string;
  firebaseAppId?: string;
}

export interface URLParts {
  timestampMicros?: number | null;
  nonPersonalizedAds?: boolean;
  eventName?: string;
  clientId?: string;
  appInstanceId?: string;
  userId?: string;
  event?: MPEvent;
  measurementId?: string;
  firebaseAppId?: string;
  apiSecret?: string;
  userProperties?: Parameters;
}

const getEventFromParams = (searchParams: URLSearchParams) => {
  if (searchParams.has("eventData")) {
    const eventDataString = searchParams.get("eventData")!;
    try {
      const decoded = atob(eventDataString);
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
          eventLabel: "event-from-url",
        });
        return emptyEvent;
      }
    } catch (e) {
      console.error(e);
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
const getUserPropertiesFromParams = (
  searchParams: URLSearchParams
): Parameters | undefined => {
  const userPropertiesString = searchParams.get(UrlParam.UserProperties);
  if (userPropertiesString !== null) {
    try {
      const decoded = atob(userPropertiesString);
      const userProperties = JSON.parse(decoded) as Parameters;
      if (Array.isArray(userProperties)) {
        // TODO - could add better asserts here in the future to make sure that
        // each value is actually a good Parameter.
        return userProperties;
      } else {
        throw new Error(`Invalid userPropertiesString: ${userProperties}`);
      }
    } catch (e) {
      console.error(e);
      // ignore
    }
  }
  return undefined;
};

export const unParameterizeUrl = (): URLParts => {
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const clientId = searchParams.get("clientId") || undefined;
  const appInstanceId = searchParams.get("appInstanceId") || undefined;
  const userId = searchParams.get("userId") || undefined;
  const event = getEventFromParams(searchParams);
  const userProperties = getUserPropertiesFromParams(searchParams);
  const measurementId = searchParams.get("measurementId") || undefined;
  const firebaseAppId = searchParams.get("firebaseAppId") || undefined;
  const apiSecret = searchParams.get("apiSecret") || undefined;
  const timestampMicrosString =
    searchParams.get("timestampMicros") || undefined;
  const timestampMicros = timestampMicrosString
    ? parseInt(timestampMicrosString, 10)
    : undefined;
  const nonPersonalizedAdsString =
    searchParams.get("nonPersonalizedAds") || undefined;
  const nonPersonalizedAds =
    nonPersonalizedAdsString === "true"
      ? true
      : nonPersonalizedAdsString === "false"
      ? false
      : undefined;
  return {
    timestampMicros,
    nonPersonalizedAds,
    appInstanceId,
    clientId,
    userId,
    event,
    userProperties,
    measurementId,
    firebaseAppId,
    apiSecret,
    eventName: event.isCustomEvent() ? event.getEventName() : undefined,
  };
};

export const parameterizedUrl = ({
  clientId,
  appInstanceId,
  userId,
  event,
  measurementId,
  firebaseAppId,
  apiSecret,
  userProperties,
  timestampMicros,
  nonPersonalizedAds,
}: URLParts) => {
  const params = new URLSearchParams();

  clientId && clientId !== "" && params.append("clientId", clientId);
  appInstanceId &&
    appInstanceId !== "" &&
    params.append("appInstanceId", appInstanceId);
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

  timestampMicros !== undefined &&
    timestampMicros !== null &&
    params.append("timestampMicros", timestampMicros.toString());

  nonPersonalizedAds !== undefined &&
    params.append("nonPersonalizedAds", nonPersonalizedAds.toString());

  // We base64 encode the JSON string to make the url a bit smaller.
  event &&
    params.append("eventData", btoa(JSON.stringify(event.getEventData())));

  if (userProperties !== undefined) {
    const filtered = userProperties.filter(
      (property) => property.value !== undefined
    );
    params.append(UrlParam.UserProperties, btoa(JSON.stringify(filtered)));
  }

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

// TODO add in type for MPPayload
export const payloadFor = (
  events: MPEvent[],
  clientIds: ClientIds,
  userProperties: Parameters,
  timestampMicros: number | null,
  nonPersonalizedAds: boolean
): {} => {
  if (clientIds.type === "web" && clientIds.clientId === "") {
    clientIds.clientId = undefined;
  } else if (clientIds.type === "mobile" && clientIds.appInstanceId === "") {
    clientIds.appInstanceId = undefined;
  }
  const { type, ...minusType } = clientIds;
  return {
    ...minusType,
    userId: clientIds.userId || undefined,
    timestampMicros: timestampMicros !== null ? timestampMicros : undefined,
    nonPersonalizedAds:
      nonPersonalizedAds !== null ? nonPersonalizedAds : undefined,
    events: events.map((event) => event.asPayload()),
    userProperties:
      userProperties.length === 0
        ? undefined
        : MPEvent.parametersToPayload(userProperties),
  };
};

export const validateHit = async (
  instanceId: InstanceId,
  api_secret: string,
  requiredId: ClientIds,
  events: MPEvent[],
  userProperties: Parameters,
  timestampMicros: number | null,
  nonPersonalizedAds: boolean
): Promise<ValidationMessage[]> => {
  const url = `https://www.google-analytics.com/debug/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`;
  const payload = payloadFor(
    events,
    requiredId,
    userProperties,
    timestampMicros,
    nonPersonalizedAds
  );
  Object.assign(payload, {
    validationBehavior: "ENFORCE_RECOMMENDATIONS",
  });
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const asJson = await result.json();
  return asJson.validationMessages as ValidationMessage[];
};

export const sendEvent = async (
  instanceId: InstanceId,
  api_secret: string,
  requiredId: ClientIds,
  events: MPEvent[],
  userProperties: Parameters,
  timestampMicros: number | null,
  nonPersonalizedAds: boolean
): Promise<Response> => {
  const url = `https://www.google-analytics.com/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`;
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(
      payloadFor(
        events,
        requiredId,
        userProperties,
        timestampMicros,
        nonPersonalizedAds
      )
    ),
  });
  return result;
};
