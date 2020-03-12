import { OptionalString } from "./parameters";
import { MPEventType } from "./index";

export type AutomaticEvent =
  | AdExposureEvent
  | AdRewardEvent
  | AppExceptionEvent
  | AppStoreRedundEvent
  | AppStoreSubscriptionCancelEvent
  | AppStoreSubscriptionConvertEvent
  | AppStoreSubscriptionRenewEvent
  | DynamicLinkAppOpenEvent
  | DynamicLinkAppUpdateEvent
  | DynamicLinkFirstOpenEvent;

interface AdExposureEvent {
  type: MPEventType.AdExposure;
  parameters: {
    firebase_screen: OptionalString;
    firebase_screen_id: OptionalString;
    firebase_screen_class: OptionalString;
    exposure_time: OptionalString;
  };
  customParameters: {};
}
interface AdRewardEvent {
  type: MPEventType.AdReward;
  parameters: {
    ad_unit_id: OptionalString;
    reward_type: OptionalString;
    reward_value: OptionalString;
  };
  customParameters: {};
}
interface AppExceptionEvent {
  type: MPEventType.AppException;
  parameters: {
    fatal: OptionalString;
    timestamp: OptionalString;
  };
  customParameters: {};
}
interface AppStoreRedundEvent {
  type: MPEventType.AppStoreRefund;
  parameters: {
    product_id: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    quantity: OptionalString;
  };
  customParameters: {};
}
interface AppStoreSubscriptionCancelEvent {
  type: MPEventType.AppStoreSubscriptionCancel;
  parameters: {
    product_id: OptionalString;
    price: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    cancellation_reason: OptionalString;
  };
  customParameters: {};
}
interface AppStoreSubscriptionConvertEvent {
  type: MPEventType.AppStoreSubscriptionConvert;
  parameters: {
    product_id: OptionalString;
    price: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    quantity: OptionalString;
  };
  customParameters: {};
}
interface AppStoreSubscriptionRenewEvent {
  type: MPEventType.AppStoreSubscriptionRenew;
  parameters: {
    product_id: OptionalString;
    price: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    quantity: OptionalString;
    renewal_count: OptionalString;
  };
  customParameters: {};
}
interface DynamicLinkAppOpenEvent {
  type: MPEventType.DynamicLinkAppOpen;
  parameters: {
    source: OptionalString;
    medium: OptionalString;
    campaign: OptionalString;
    link_id: OptionalString;
    accept_time: OptionalString;
  };
  customParameters: {};
}
interface DynamicLinkAppUpdateEvent {
  type: MPEventType.DynamicLinkAppUpdate;
  parameters: {
    source: OptionalString;
    medium: OptionalString;
    campaign: OptionalString;
    link_id: OptionalString;
    accept_time: OptionalString;
  };
  customParameters: {};
}
interface DynamicLinkFirstOpenEvent {
  type: MPEventType.DynamicLinkFirstOpen;
  parameters: {
    source: OptionalString;
    medium: OptionalString;
    campaign: OptionalString;
    link_id: OptionalString;
    accept_time: OptionalString;
  };
  customParameters: {};
}
