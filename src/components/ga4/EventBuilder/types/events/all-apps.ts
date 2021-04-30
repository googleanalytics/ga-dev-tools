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
import { StringParam, ItemArrayParam } from "./parameters"

export type AllAppsEvent =
  | EarnVirtualCurrencyEvent
  | JoinGroupEvent
  | LoginEvent
  | PresentOfferEvent
  | PurchaseEvent
  | RefundEvent
  | SearchEvent
  | SelectContentEvent
  | ShareEvent
  | SignUpEvent
  | SpendVirtualCurrencyEvent
  | TutorialBeginEvent
  | TutorialCompleteEvent
  | EarnVirtualCurrencyEvent

type EarnVirtualCurrencyEvent = EventData<
  MPEventType.EarnVirtualCurrency,
  StringParam<"virtual_currency_name"> | StringParam<"value">
>

type JoinGroupEvent = EventData<MPEventType.JoinGroup, StringParam<"group_id">>

type LoginEvent = EventData<MPEventType.Login, StringParam<"method">>

type PresentOfferEvent = EventData<
  MPEventType.PresentOffer,
  | StringParam<"item_id">
  | StringParam<"item_name">
  | StringParam<"item_category">
>

type PurchaseEvent = EventData<
  MPEventType.Purchase,
  | StringParam<"transactions_id">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"tax">
  | StringParam<"shipping">
  | ItemArrayParam
  | StringParam<"coupon">
  | StringParam<"affiliation">
>

type RefundEvent = EventData<
  MPEventType.Refund,
  | StringParam<"transactions_id">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"tax">
  | StringParam<"shipping">
  | ItemArrayParam
>

type SearchEvent = EventData<MPEventType.Search, StringParam<"search_term">>

type SelectContentEvent = EventData<
  MPEventType.SelectContent,
  StringParam<"content_type"> | StringParam<"item_id">
>

type ShareEvent = EventData<
  MPEventType.Share,
  StringParam<"content_type"> | StringParam<"item_id">
>

type SignUpEvent = EventData<MPEventType.SignUp, StringParam<"method">>

type SpendVirtualCurrencyEvent = EventData<
  MPEventType.SpendVirtualCurrency,
  | StringParam<"item_name">
  | StringParam<"virtual_currency_name">
  | StringParam<"value">
>

type TutorialBeginEvent = EventData<MPEventType.TutorialBegin, never>

type TutorialCompleteEvent = EventData<MPEventType.TutorialComplete, never>
