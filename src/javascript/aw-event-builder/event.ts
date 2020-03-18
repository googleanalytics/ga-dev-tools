import { ValidationMessage, MPEvent } from "./types";

export interface UserOrClientId {
  user_id?: string;
  client_id?: string;
}

export interface InstanceId {
  measurement_id?: string;
  firebase_app_id?: string;
}

export const validateHit = async (
  instanceId: InstanceId,
  api_secret: string,
  requiredId: UserOrClientId,
  events: MPEvent[]
): Promise<ValidationMessage[]> => {
  const instanceQueryParam =
    instanceId.firebase_app_id !== undefined
      ? `&firebase_app_id=${instanceId.firebase_app_id}`
      : instanceId !== undefined
      ? `&measurement_id=${instanceId.measurement_id}`
      : "";
  const url = `https://www.google-analytics.com/debug/mp/collect?api_secret=${api_secret}${instanceQueryParam}`;
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
  const instanceQueryParam =
    instanceId.firebase_app_id !== undefined
      ? `&firebase_app_id=${instanceId.firebase_app_id}`
      : instanceId !== undefined
      ? `&measurement_id=${instanceId.measurement_id}`
      : "";
  const url = `https://www.google-analytics.com/mp/collect?api_secret=${api_secret}${instanceQueryParam}`;
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
