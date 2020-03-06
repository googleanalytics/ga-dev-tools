import { ValidationMessage, MPEvent } from "./types";

interface ClientId {
  client_id?: string;
}

interface UserId {
  user_id?: string;
}

export type UserOrClientId = ClientId | UserId;

export const validateHit = async (
  mid: string,
  auth_key: string,
  requiredId: UserOrClientId,
  events: MPEvent[]
): Promise<ValidationMessage[]> => {
  const url = `https://www.google-analytics.com/debug/mpfg/collect?mid=${mid}&auth_key=${auth_key}`;
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
  mid: string,
  auth_key: string,
  requiredId: UserOrClientId,
  events: MPEvent[]
): Promise<Response> => {
  const url = `https://www.google-analytics.com/mpfg/collect?mid=${mid}&auth_key=${auth_key}`;
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
