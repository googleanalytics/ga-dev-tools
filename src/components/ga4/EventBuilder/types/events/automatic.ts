// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { EventData, MPEventType } from "."
import { StringParam } from "./parameters"

export type AutomaticEvent =
  | AdRewardEvent
  | AppExceptionEvent
  | AppStoreRedundEvent
  | AppStoreSubscriptionCancelEvent
  | AppStoreSubscriptionConvertEvent
  | AppStoreSubscriptionRenewEvent
  | DynamicLinkAppOpenEvent
  | DynamicLinkAppUpdateEvent
  | DynamicLinkFirstOpenEvent

type AdRewardEvent = EventData<
  MPEventType.AdReward,
  | StringParam<"ad_unit_id">
  | StringParam<"reward_type">
  | StringParam<"reward_value">
>
type AppExceptionEvent = EventData<
  MPEventType.AppException,
  StringParam<"fatal"> | StringParam<"timestamp">
>
type AppStoreRedundEvent = EventData<
  MPEventType.AppStoreRefund,
  | StringParam<"product_id">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"quantity">
>
type AppStoreSubscriptionCancelEvent = EventData<
  MPEventType.AppStoreSubscriptionCancel,
  | StringParam<"product_id">
  | StringParam<"price">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"cancellation_reason">
>
type AppStoreSubscriptionConvertEvent = EventData<
  MPEventType.AppStoreSubscriptionConvert,
  | StringParam<"product_id">
  | StringParam<"price">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"quantity">
>
type AppStoreSubscriptionRenewEvent = EventData<
  MPEventType.AppStoreSubscriptionRenew,
  | StringParam<"product_id">
  | StringParam<"price">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"quantity">
  | StringParam<"renewal_count">
>
type DynamicLinkAppOpenEvent = EventData<
  MPEventType.DynamicLinkAppOpen,
  | StringParam<"source">
  | StringParam<"medium">
  | StringParam<"campaign">
  | StringParam<"link_id">
  | StringParam<"accept_time">
>
type DynamicLinkAppUpdateEvent = EventData<
  MPEventType.DynamicLinkAppUpdate,
  | StringParam<"source">
  | StringParam<"medium">
  | StringParam<"campaign">
  | StringParam<"link_id">
  | StringParam<"accept_time">
>
type DynamicLinkFirstOpenEvent = EventData<
  MPEventType.DynamicLinkFirstOpen,
  | StringParam<"source">
  | StringParam<"medium">
  | StringParam<"campaign">
  | StringParam<"link_id">
  | StringParam<"accept_time">
>
