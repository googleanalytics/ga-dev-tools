import { StringParam } from "./parameters";
import { MPEventType, EventData } from "./index";

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

type AdExposureEvent = EventData<
  MPEventType.AdExposure,
  | StringParam<"firebase_screen">
  | StringParam<"firebase_screen_id">
  | StringParam<"firebase_screen_class">
  | StringParam<"exposure_time">
>;
type AdRewardEvent = EventData<
  MPEventType.AdReward,
  | StringParam<"ad_unit_id">
  | StringParam<"reward_type">
  | StringParam<"reward_value">
>;
type AppExceptionEvent = EventData<
  MPEventType.AppException,
  StringParam<"fatal"> | StringParam<"timestamp">
>;
type AppStoreRedundEvent = EventData<
  MPEventType.AppStoreRefund,
  | StringParam<"product_id">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"quantity">
>;
type AppStoreSubscriptionCancelEvent = EventData<
  MPEventType.AppStoreSubscriptionCancel,
  | StringParam<"product_id">
  | StringParam<"price">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"cancellation_reason">
>;
type AppStoreSubscriptionConvertEvent = EventData<
  MPEventType.AppStoreSubscriptionConvert,
  | StringParam<"product_id">
  | StringParam<"price">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"quantity">
>;
type AppStoreSubscriptionRenewEvent = EventData<
  MPEventType.AppStoreSubscriptionRenew,
  | StringParam<"product_id">
  | StringParam<"price">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"quantity">
  | StringParam<"renewal_count">
>;
type DynamicLinkAppOpenEvent = EventData<
  MPEventType.DynamicLinkAppOpen,
  | StringParam<"source">
  | StringParam<"medium">
  | StringParam<"campaign">
  | StringParam<"link_id">
  | StringParam<"accept_time">
>;
type DynamicLinkAppUpdateEvent = EventData<
  MPEventType.DynamicLinkAppUpdate,
  | StringParam<"source">
  | StringParam<"medium">
  | StringParam<"campaign">
  | StringParam<"link_id">
  | StringParam<"accept_time">
>;
type DynamicLinkFirstOpenEvent = EventData<
  MPEventType.DynamicLinkFirstOpen,
  | StringParam<"source">
  | StringParam<"medium">
  | StringParam<"campaign">
  | StringParam<"link_id">
  | StringParam<"accept_time">
>;
