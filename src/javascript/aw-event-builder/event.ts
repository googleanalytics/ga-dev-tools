import { ValidationMessage, MPEvent } from "./types";

export interface UserOrClientId {
  userId?: string;
  clientId?: string;
}

export interface InstanceId {
  measurement_id?: string;
  firebase_app_id?: string;
}

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
  return asJson.validationMessage as ValidationMessage[];
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
