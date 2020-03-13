import { OptionalString } from "./parameters";
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
  | OptionalString<"firebase_screen">
  | OptionalString<"firebase_screen_id">
  | OptionalString<"firebase_screen_class">
  | OptionalString<"exposure_time">
>;
type AdRewardEvent = EventData<
  MPEventType.AdReward,
  | OptionalString<"ad_unit_id">
  | OptionalString<"reward_type">
  | OptionalString<"reward_value">
>;
type AppExceptionEvent = EventData<
  MPEventType.AppException,
  OptionalString<"fatal"> | OptionalString<"timestamp">
>;
type AppStoreRedundEvent = EventData<
  MPEventType.AppStoreRefund,
  | OptionalString<"product_id">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"quantity">
>;
type AppStoreSubscriptionCancelEvent = EventData<
  MPEventType.AppStoreSubscriptionCancel,
  | OptionalString<"product_id">
  | OptionalString<"price">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"cancellation_reason">
>;
type AppStoreSubscriptionConvertEvent = EventData<
  MPEventType.AppStoreSubscriptionConvert,
  | OptionalString<"product_id">
  | OptionalString<"price">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"quantity">
>;
type AppStoreSubscriptionRenewEvent = EventData<
  MPEventType.AppStoreSubscriptionRenew,
  | OptionalString<"product_id">
  | OptionalString<"price">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"quantity">
  | OptionalString<"renewal_count">
>;
type DynamicLinkAppOpenEvent = EventData<
  MPEventType.DynamicLinkAppOpen,
  | OptionalString<"source">
  | OptionalString<"medium">
  | OptionalString<"campaign">
  | OptionalString<"link_id">
  | OptionalString<"accept_time">
>;
type DynamicLinkAppUpdateEvent = EventData<
  MPEventType.DynamicLinkAppUpdate,
  | OptionalString<"source">
  | OptionalString<"medium">
  | OptionalString<"campaign">
  | OptionalString<"link_id">
  | OptionalString<"accept_time">
>;
type DynamicLinkFirstOpenEvent = EventData<
  MPEventType.DynamicLinkFirstOpen,
  | OptionalString<"source">
  | OptionalString<"medium">
  | OptionalString<"campaign">
  | OptionalString<"link_id">
  | OptionalString<"accept_time">
>;
