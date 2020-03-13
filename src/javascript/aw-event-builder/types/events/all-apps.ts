import { OptionalString } from "./parameters";
import { MPEventType, EventData } from "./index";

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
  | EarnVirtualCurrencyEvent;

type EarnVirtualCurrencyEvent = EventData<
  MPEventType.EarnVirtualCurrency,
  OptionalString<"virtual_currency_name"> | OptionalString<"value">
>;

type JoinGroupEvent = EventData<
  MPEventType.JoinGroup,
  OptionalString<"group_id">
>;

type LoginEvent = EventData<MPEventType.Login, OptionalString<"method">>;

type PresentOfferEvent = EventData<
  MPEventType.PresentOffer,
  | OptionalString<"item_id">
  | OptionalString<"item_name">
  | OptionalString<"item_category">
>;

type PurchaseEvent = EventData<
  MPEventType.Purchase,
  | OptionalString<"transactions_id">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"tax">
  | OptionalString<"shipping">
  | OptionalString<"items">
  | OptionalString<"coupon">
  | OptionalString<"affiliation">
>;

type RefundEvent = EventData<
  MPEventType.Refund,
  | OptionalString<"transactions_id">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"tax">
  | OptionalString<"shipping">
  | OptionalString<"items">
>;

type SearchEvent = EventData<MPEventType.Search, OptionalString<"search_term">>;

type SelectContentEvent = EventData<
  MPEventType.SelectContent,
  OptionalString<"content_type"> | OptionalString<"item_id">
>;

type ShareEvent = EventData<
  MPEventType.Share,
  OptionalString<"content_type"> | OptionalString<"item_id">
>;

type SignUpEvent = EventData<MPEventType.SignUp, OptionalString<"method">>;

type SpendVirtualCurrencyEvent = EventData<
  MPEventType.SpendVirtualCurrency,
  | OptionalString<"item_name">
  | OptionalString<"virtual_currency_name">
  | OptionalString<"value">
>;

type TutorialBeginEvent = EventData<MPEventType.TutorialBegin, never>;

type TutorialCompleteEvent = EventData<MPEventType.TutorialComplete, never>;
