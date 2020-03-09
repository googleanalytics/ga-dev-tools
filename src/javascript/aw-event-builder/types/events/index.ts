import {
  Parameters,
  defaultItemArray,
  defaultOptionalString
} from "./parameters";
import { AllAppsEvent } from "./all-apps";

export * from "./parameters";

// EVENTS start here
export enum MPEventType {
  // Custom Event
  CustomEvent = "custom_event",
  // All Apps
  EarnVirtualCurrency = "earn_virtual_currency",
  JoinGroup = "join_group",
  Login = "login",
  PresentOffer = "present_offer",
  Purchase = "purchase",
  Refund = "refund",
  Search = "search",
  SelectContent = "select_content",
  Share = "share",
  SignUp = "sign_up",
  SpendVirtualCurrency = "spend_virtual_currency",
  TutorialBegin = "tutorial_begin",
  TutorialComplete = "tutorial_complete"
}

// Events: Custom
interface CustomEvent {
  type: MPEventType.CustomEvent;
  parameters: {};
  customParameters: Parameters;
}

export type MPEventData = CustomEvent | AllAppsEvent;

export const emptyEvent = (eventType: MPEventType): MPEventData => {
  switch (eventType) {
    case MPEventType.CustomEvent:
      return {
        type: eventType,
        parameters: {},
        customParameters: {}
      };
    case MPEventType.EarnVirtualCurrency:
      return {
        type: eventType,
        parameters: {
          virtual_currency_name: defaultOptionalString("virtual_currency_name"),
          value: defaultOptionalString("value")
        },
        customParameters: {}
      };
    case MPEventType.JoinGroup:
      return {
        type: eventType,
        parameters: { group_id: defaultOptionalString("group_id") },
        customParameters: {}
      };
    case MPEventType.Login:
      return {
        type: eventType,
        parameters: { method: defaultOptionalString("method") },
        customParameters: {}
      };
    case MPEventType.PresentOffer:
      return {
        type: eventType,
        parameters: {
          item_id: defaultOptionalString("item_id"),
          item_name: defaultOptionalString("item_name"),
          item_category: defaultOptionalString("item_category")
        },
        customParameters: {}
      };
    case MPEventType.Purchase:
      return {
        type: eventType,
        parameters: {
          transactions_id: defaultOptionalString("transactions_id"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          tax: defaultOptionalString("tax"),
          shipping: defaultOptionalString("shipping"),
          items: defaultItemArray("items"),
          coupon: defaultOptionalString("coupon")
        },
        customParameters: {}
      };
    case MPEventType.Refund:
      return {
        type: eventType,
        parameters: {
          transactions_id: defaultOptionalString("transactions_id"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          tax: defaultOptionalString("tax"),
          shipping: defaultOptionalString("shipping"),
          items: defaultItemArray("items")
        },
        customParameters: {}
      };
    case MPEventType.Search:
      return {
        type: eventType,
        parameters: { search_term: defaultOptionalString("search_term") },
        customParameters: {}
      };
    case MPEventType.SelectContent:
      return {
        type: eventType,
        parameters: {
          content_type: defaultOptionalString("content_type"),
          item_id: defaultOptionalString("item_id")
        },
        customParameters: {}
      };
    case MPEventType.Share:
      return {
        type: eventType,
        parameters: {
          content_type: defaultOptionalString("content_type"),
          item_id: defaultOptionalString("item_id")
        },
        customParameters: {}
      };
    case MPEventType.SignUp:
      return {
        type: eventType,
        parameters: { method: defaultOptionalString("method") },
        customParameters: {}
      };
    case MPEventType.SpendVirtualCurrency:
      return {
        type: eventType,
        parameters: {
          virtual_currency_name: defaultOptionalString("virtual_currency_name"),
          value: defaultOptionalString("value"),
          item_name: defaultOptionalString("item_name")
        },
        customParameters: {}
      };
    case MPEventType.TutorialBegin:
      return { type: eventType, parameters: {}, customParameters: {} };
    case MPEventType.TutorialComplete:
      return { type: eventType, parameters: {}, customParameters: {} };
  }
};
