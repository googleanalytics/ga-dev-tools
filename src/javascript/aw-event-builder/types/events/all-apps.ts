import { StringParam, ItemArrayParam } from "./parameters";
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
  StringParam<"virtual_currency_name"> | StringParam<"value">
>;

type JoinGroupEvent = EventData<MPEventType.JoinGroup, StringParam<"group_id">>;

type LoginEvent = EventData<MPEventType.Login, StringParam<"method">>;

type PresentOfferEvent = EventData<
  MPEventType.PresentOffer,
  | StringParam<"item_id">
  | StringParam<"item_name">
  | StringParam<"item_category">
>;

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
>;

type RefundEvent = EventData<
  MPEventType.Refund,
  | StringParam<"transactions_id">
  | StringParam<"value">
  | StringParam<"currency">
  | StringParam<"tax">
  | StringParam<"shipping">
  | ItemArrayParam
>;

type SearchEvent = EventData<MPEventType.Search, StringParam<"search_term">>;

type SelectContentEvent = EventData<
  MPEventType.SelectContent,
  StringParam<"content_type"> | StringParam<"item_id">
>;

type ShareEvent = EventData<
  MPEventType.Share,
  StringParam<"content_type"> | StringParam<"item_id">
>;

type SignUpEvent = EventData<MPEventType.SignUp, StringParam<"method">>;

type SpendVirtualCurrencyEvent = EventData<
  MPEventType.SpendVirtualCurrency,
  | StringParam<"item_name">
  | StringParam<"virtual_currency_name">
  | StringParam<"value">
>;

type TutorialBeginEvent = EventData<MPEventType.TutorialBegin, never>;

type TutorialCompleteEvent = EventData<MPEventType.TutorialComplete, never>;
