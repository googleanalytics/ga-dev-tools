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
  client_id?: string;
  user_id?: string;
}

interface MobileIds {
  type: "mobile";
  app_instance_id?: string;
  user_id?: string;
}

export type ClientIds = WebIds | MobileIds;

export interface InstanceId {
  measurement_id?: string;
  firebase_app_id?: string;
}

export interface URLParts {
  timestamp_micros?: number | null;
  non_personalized_ads?: boolean;
  event_name?: string;
  client_id?: string;
  app_instance_id?: string;
  user_id?: string;
  event?: MPEvent;
  measurement_id?: string;
  firebase_app_id?: string;
  api_secret?: string;
  user_properties?: Parameters;
}

const getEventFromParams = (searchParams: URLSearchParams) => {
  if (searchParams.has("eventData")) {
    const eventDataString = searchParams.get(UrlParam.EventData)!;
    try {
      const decoded = atob(eventDataString);
      const eventData = JSON.parse(decoded) as MPEventData;
      const eventType = MPEvent.eventTypeFromString(eventData.type as string);
      if (eventType !== undefined) {
        let emptyEvent = MPEvent.empty(eventType);
        if (eventType === MPEventType.CustomEvent) {
          const eventName = searchParams.get(UrlParam.EventName);
          if (eventName !== null) {
            emptyEvent = emptyEvent.updateName(eventName);
          }
        }
        const parameters = eventData.parameters;
        if (parameters !== undefined) {
          emptyEvent = emptyEvent.updateParameters(() => parameters);
        }
        gaAll("send", "event", {
          eventCategory: "GA4 Event Builder",
          eventAction: "hydrate",
          eventLabel: "event-from-url",
        });
        return emptyEvent;
      }
    } catch (e) {
      console.error(e);
      // ignore
    }
  } else if (searchParams.has(UrlParam.EventType)) {
    const eventType = MPEvent.eventTypeFromString(
      searchParams.get(UrlParam.EventType)!
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
  const client_id = searchParams.get("client_id") || undefined;
  const app_instance_id = searchParams.get("app_instance_id") || undefined;
  const user_id = searchParams.get("user_id") || undefined;
  const event = getEventFromParams(searchParams);
  const user_properties = getUserPropertiesFromParams(searchParams);
  const measurement_id = searchParams.get("measurement_id") || undefined;
  const firebase_app_id = searchParams.get("firebase_app_id") || undefined;
  const api_secret = searchParams.get("api_secret") || undefined;
  const timestampMicrosString =
    searchParams.get("timestamp_micros") || undefined;
  const timestamp_micros = timestampMicrosString
    ? parseInt(timestampMicrosString, 10)
    : undefined;
  const nonPersonalizedAdsString =
    searchParams.get("non_personalized_ads") || undefined;
  const non_personalized_ads =
    nonPersonalizedAdsString === "true"
      ? true
      : nonPersonalizedAdsString === "false"
      ? false
      : undefined;
  return {
    timestamp_micros,
    non_personalized_ads,
    app_instance_id,
    client_id,
    user_id,
    event,
    user_properties,
    measurement_id,
    firebase_app_id,
    api_secret,
    event_name: event.isCustomEvent() ? event.getEventName() : undefined,
  };
};

export const parameterizedUrl = ({
  client_id,
  app_instance_id,
  user_id,
  event,
  measurement_id,
  firebase_app_id,
  api_secret,
  user_properties,
  timestamp_micros,
  non_personalized_ads,
}: URLParts) => {
  const params = new URLSearchParams();

  client_id && client_id !== "" && params.append("client_id", client_id);
  app_instance_id &&
    app_instance_id !== "" &&
    params.append("app_instance_id", app_instance_id);
  user_id && user_id !== "" && params.append("user_id", user_id);
  api_secret && api_secret !== "" && params.append("api_secret", api_secret);
  event &&
    event.getEventType() === MPEventType.CustomEvent &&
    params.append("event_name", event.getEventName());

  measurement_id &&
    measurement_id !== "" &&
    params.append("measurement_id", measurement_id);

  firebase_app_id &&
    firebase_app_id !== "" &&
    params.append("firebase_app_id", firebase_app_id);

  timestamp_micros !== undefined &&
    timestamp_micros !== null &&
    params.append("timestamp_micros", timestamp_micros.toString());

  non_personalized_ads !== undefined &&
    params.append("non_personalized_ads", non_personalized_ads.toString());

  // We base64 encode the JSON string to make the url a bit smaller.
  event &&
    params.append(
      UrlParam.EventData,
      btoa(JSON.stringify(event.getEventData()))
    );

  if (user_properties !== undefined) {
    const filtered = user_properties.filter(
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
  if (instanceId.firebase_app_id !== "") {
    return `firebase_app_id=${instanceId.firebase_app_id}`;
  }
  if (instanceId.measurement_id !== "") {
    return `measurement_id=${instanceId.measurement_id}`;
  }
  return `measurement_id=`;
};

// TODO add in type for MPPayload
export const payloadFor = (
  events: MPEvent[],
  clientIds: ClientIds,
  user_properties: Parameters,
  timestamp_micros: number | null,
  non_personalized_ads: boolean
): {} => {
  if (clientIds.type === "web" && clientIds.client_id === "") {
    clientIds.client_id = undefined;
  } else if (clientIds.type === "mobile" && clientIds.app_instance_id === "") {
    clientIds.app_instance_id = undefined;
  }
  const { type, ...minusType } = clientIds;
  return {
    ...minusType,
    user_id: clientIds.user_id || undefined,
    timestamp_micros: timestamp_micros !== null ? timestamp_micros : undefined,
    non_personalized_ads:
      non_personalized_ads !== null ? non_personalized_ads : undefined,
    events: events.map((event) => event.asPayload()),
    user_properties:
      user_properties.length === 0
        ? undefined
        : MPEvent.parametersToPayload(user_properties),
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
