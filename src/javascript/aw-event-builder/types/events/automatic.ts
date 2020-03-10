import { OptionalString } from "./parameters";
import { MPEventType } from "./index";

export type AutomaticEvent =
  | AdClickEvent
  | AdExposureEvent
  | AdImpressionEvent
  | AdQueryEvent
  | AdRewardEvent
  | AdunitExposureEvent
  | AppClearDataEvent
  | AppExceptionEvent
  | AppRemoveEvent
  | AppStoreRedundEvent
  | AppStoreSubscriptionCancelEvent
  | AppStoreSubscriptionConvertEvent
  | AppStoreSubscriptionRenewEvent
  | AppUpdateEvent
  | DynamicLinkAppOpenEvent
  | DynamicLinkAppUpdateEvent
  | DynamicLinkFirstOpenEvent
  | FirstOpenEvent
  | InAppPurchaseEvent
  | NotificationDismissEvent
  | NotificationForgroundEvent
  | NotificationOpenEvent
  | NotificationReceiveEvent
  | OsUpdateEvent
  | ScreenViewEvent
  | SessionStartEvent
  | UserEngagementEvent;

interface AdClickEvent {
  type: MPEventType.AdClick;
  parameters: {
    ad_event_id: OptionalString;
  };
  customParameters: {};
}
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
interface AdImpressionEvent {
  type: MPEventType.AdImpression;
  parameters: {
    ad_event_id: OptionalString;
  };
  customParameters: {};
}
interface AdQueryEvent {
  type: MPEventType.AdQuery;
  parameters: {
    ad_event_id: OptionalString;
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
interface AdunitExposureEvent {
  type: MPEventType.AdunitExposure;
  parameters: {
    firebase_screen: OptionalString;
    firebase_screen_id: OptionalString;
    firebase_screen_class: OptionalString;
    exposure_time: OptionalString;
  };
  customParameters: {};
}
interface AppClearDataEvent {
  type: MPEventType.AppClearData;
  parameters: {};
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
interface AppRemoveEvent {
  type: MPEventType.AppRemove;
  parameters: {};
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
interface AppUpdateEvent {
  type: MPEventType.AppUpdate;
  parameters: {
    previous_app_version: OptionalString;
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
interface FirstOpenEvent {
  type: MPEventType.FirstOpen;
  parameters: {
    previoius_gmp_app_id: OptionalString;
    updated_with_analytics: OptionalString;
    previous_first_open_count: OptionalString;
    system_app: OptionalString;
    system_app_update: OptionalString;
    deferred_analytics_collection: OptionalString;
    reset_analytics_cause: OptionalString;
  };
  customParameters: {};
}
interface InAppPurchaseEvent {
  type: MPEventType.InAppPurchase;
  parameters: {
    product_id: OptionalString;
    price: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    quantity: OptionalString;
    subscription: OptionalString;
    free_trial: OptionalString;
    introductory_price: OptionalString;
  };
  customParameters: {};
}
interface NotificationDismissEvent {
  type: MPEventType.NotificationDismiss;
  parameters: {
    message_name: OptionalString;
    message_time: OptionalString;
    message_device_time: OptionalString;
    message_id: OptionalString;
    topic: OptionalString;
    label: OptionalString;
    message_channel: OptionalString;
  };
  customParameters: {};
}
interface NotificationForgroundEvent {
  type: MPEventType.NotificationForeground;
  parameters: {
    message_name: OptionalString;
    message_time: OptionalString;
    message_device_time: OptionalString;
    message_id: OptionalString;
    topic: OptionalString;
    label: OptionalString;
    message_channel: OptionalString;
    message_type: OptionalString;
  };
  customParameters: {};
}
interface NotificationOpenEvent {
  type: MPEventType.NotificationOpen;
  parameters: {
    message_name: OptionalString;
    message_time: OptionalString;
    message_device_time: OptionalString;
    message_id: OptionalString;
    topic: OptionalString;
    label: OptionalString;
    message_channel: OptionalString;
  };
  customParameters: {};
}
interface NotificationReceiveEvent {
  type: MPEventType.NotificationReceive;
  parameters: {
    message_name: OptionalString;
    message_time: OptionalString;
    message_device_time: OptionalString;
    message_id: OptionalString;
    topic: OptionalString;
    label: OptionalString;
    message_channel: OptionalString;
    message_type: OptionalString;
  };
  customParameters: {};
}
interface OsUpdateEvent {
  type: MPEventType.OsUpdate;
  parameters: {
    previous_os_version: OptionalString;
  };
  customParameters: {};
}
interface ScreenViewEvent {
  type: MPEventType.ScreenView;
  parameters: {
    firebase_screen: OptionalString;
    firebase_screen_class: OptionalString;
    firebase_screen_id: OptionalString;
    firebase_previous_screen: OptionalString;
    firebase_previous_class: OptionalString;
    firebase_previous_id: OptionalString;
  };
  customParameters: {};
}
interface SessionStartEvent {
  type: MPEventType.SessionStart;
  parameters: {};
  customParameters: {};
}
interface UserEngagementEvent {
  type: MPEventType.UserEngagement;
  parameters: {
    engagement_time_msec: OptionalString;
  };
  customParameters: {};
}
