import { defaultItemArray, defaultOptionalString } from "./parameters";
import { MPEventType, MPEventData } from "./index";

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
          coupon: defaultOptionalString("coupon"),
          affiliation: defaultOptionalString("appiliation")
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

    // Retail Ecommerce
    case MPEventType.AddPaymentInfo:
      return { type: eventType, parameters: {}, customParameters: {} };
    case MPEventType.AddToCart:
      return {
        type: eventType,
        parameters: {
          quantity: defaultOptionalString("quantity"),
          item_category: defaultOptionalString("item_category"),
          item_name: defaultOptionalString("item_name"),
          item_id: defaultOptionalString("item_id"),
          item_location_id: defaultOptionalString("item_location_id"),
          value: defaultOptionalString("value"),
          price: defaultOptionalString("price"),
          currency: defaultOptionalString("currency")
        },
        customParameters: {}
      };
    case MPEventType.AddToWishlist:
      return {
        type: eventType,
        parameters: {
          quantity: defaultOptionalString("quantity"),
          item_category: defaultOptionalString("item_category"),
          item_name: defaultOptionalString("item_name"),
          item_id: defaultOptionalString("item_id"),
          item_location_id: defaultOptionalString("item_location_id"),
          value: defaultOptionalString("value"),
          price: defaultOptionalString("price"),
          currency: defaultOptionalString("currency")
        },
        customParameters: {}
      };
    case MPEventType.BeginCheckout:
      return {
        type: eventType,
        parameters: {
          coupon: defaultOptionalString("coupon"),
          currency: defaultOptionalString("currency"),
          value: defaultOptionalString("value")
        },
        customParameters: {}
      };
    case MPEventType.EcommercePurchase:
      return {
        type: eventType,
        parameters: {
          coupon: defaultOptionalString("coupon"),
          currency: defaultOptionalString("currency"),
          value: defaultOptionalString("value"),
          tax: defaultOptionalString("tax"),
          shipping: defaultOptionalString("shipping"),
          transation_id: defaultOptionalString("transation_id")
        },
        customParameters: {}
      };
    case MPEventType.GenerateLead:
      return {
        type: eventType,
        parameters: {
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency")
        },
        customParameters: {}
      };
    case MPEventType.PurchaseRefund:
      return {
        type: eventType,
        parameters: {
          quantity: defaultOptionalString("quantity"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          transaction_id: defaultOptionalString("transaction_id")
        },
        customParameters: {}
      };
    case MPEventType.ViewItem:
      return {
        type: eventType,
        parameters: {
          item_id: defaultOptionalString("item_id"),
          item_location_id: defaultOptionalString("item_location_id")
        },
        customParameters: {}
      };
    case MPEventType.ViewItemList:
      return {
        type: eventType,
        parameters: {
          item_category: defaultOptionalString("item_category")
        },
        customParameters: {}
      };
    case MPEventType.ViewSearchResults:
      return {
        type: eventType,
        parameters: {
          search_term: defaultOptionalString("search_term")
        },
        customParameters: {}
      };
  }
};
