import { OptionalString, Parameters, ItemArray } from "./parameters";
import { MPEventType } from "./index";

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

interface EarnVirtualCurrencyEvent {
  type: MPEventType.EarnVirtualCurrency;
  parameters: { virtual_currency_name: OptionalString; value: OptionalString };
  customParameters: Parameters;
}
interface JoinGroupEvent {
  type: MPEventType.JoinGroup;
  parameters: { group_id: OptionalString };
  customParameters: Parameters;
}
interface LoginEvent {
  type: MPEventType.Login;
  parameters: { method: OptionalString };
  customParameters: Parameters;
}
interface PresentOfferEvent {
  type: MPEventType.PresentOffer;
  parameters: {
    item_id: OptionalString;
    item_name: OptionalString;
    item_category: OptionalString;
  };
  customParameters: Parameters;
}
interface PurchaseEvent {
  type: MPEventType.Purchase;
  parameters: {
    transactions_id: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    tax: OptionalString;
    shipping: OptionalString;
    items: ItemArray;
    coupon: OptionalString;
  };
  customParameters: Parameters;
}
interface RefundEvent {
  type: MPEventType.Refund;
  parameters: {
    transactions_id: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    tax: OptionalString;
    shipping: OptionalString;
    items: ItemArray;
  };
  customParameters: Parameters;
}

interface SearchEvent {
  type: MPEventType.Search;
  parameters: { search_term: OptionalString };
  customParameters: Parameters;
}
interface SelectContentEvent {
  type: MPEventType.SelectContent;
  parameters: { content_type: OptionalString; item_id: OptionalString };
  customParameters: Parameters;
}
interface ShareEvent {
  type: MPEventType.Share;
  parameters: { content_type: OptionalString; item_id: OptionalString };
  customParameters: Parameters;
}
interface SignUpEvent {
  type: MPEventType.SignUp;
  parameters: { method: OptionalString };
  customParameters: Parameters;
}
interface SpendVirtualCurrencyEvent {
  type: MPEventType.SpendVirtualCurrency;
  parameters: {
    item_name: OptionalString;
    virtual_currency_name: OptionalString;
    value: OptionalString;
  };
  customParameters: Parameters;
}
interface TutorialBeginEvent {
  type: MPEventType.TutorialBegin;
  parameters: {};
  customParameters: Parameters;
}
interface TutorialCompleteEvent {
  type: MPEventType.TutorialComplete;
  parameters: {};
  customParameters: Parameters;
}
