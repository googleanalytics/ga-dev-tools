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
    case MPEventType.LevelUp:
      return {
        type: eventType,
        parameters: {
          character: defaultOptionalString("character"),
          level: defaultOptionalString("level")
        },
        customParameters: {}
      };
    case MPEventType.PostScore:
      return {
        type: eventType,
        parameters: {
          level: defaultOptionalString("level"),
          character: defaultOptionalString("character"),
          score: defaultOptionalString("score")
        },
        customParameters: {}
      };
    case MPEventType.UnlockAchievement:
      return {
        type: eventType,
        parameters: {
          achievement_id: defaultOptionalString("achievement_id")
        },
        customParameters: {}
      };
    case MPEventType.AdExposure:
      return {
        type: eventType,
        parameters: {
          firebase_screen: defaultOptionalString("firebase_screen"),
          firebase_screen_id: defaultOptionalString("firebase_screen_id"),
          firebase_screen_class: defaultOptionalString("firebase_screen_class"),
          exposure_time: defaultOptionalString("exposure_time")
        },
        customParameters: {}
      };
    case MPEventType.AdReward:
      return {
        type: eventType,
        parameters: {
          ad_unit_id: defaultOptionalString("ad_unit_id"),
          reward_type: defaultOptionalString("reward_type"),
          reward_value: defaultOptionalString("reward_value")
        },
        customParameters: {}
      };
    case MPEventType.AppException:
      return {
        type: eventType,
        parameters: {
          fatal: defaultOptionalString("fatal"),
          timestamp: defaultOptionalString("timestamp")
        },
        customParameters: {}
      };
    case MPEventType.AppStoreRefund:
      return {
        type: eventType,
        parameters: {
          product_id: defaultOptionalString("product_id"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          quantity: defaultOptionalString("quantity")
        },
        customParameters: {}
      };
    case MPEventType.AppStoreSubscriptionCancel:
      return {
        type: eventType,
        parameters: {
          product_id: defaultOptionalString("product_id"),
          price: defaultOptionalString("price"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          cancellation_reason: defaultOptionalString("cancellation_reason")
        },
        customParameters: {}
      };
    case MPEventType.AppStoreSubscriptionConvert:
      return {
        type: eventType,
        parameters: {
          product_id: defaultOptionalString("product_id"),
          price: defaultOptionalString("price"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          quantity: defaultOptionalString("quantity")
        },
        customParameters: {}
      };
    case MPEventType.AppStoreSubscriptionRenew:
      return {
        type: eventType,
        parameters: {
          product_id: defaultOptionalString("product_id"),
          price: defaultOptionalString("price"),
          value: defaultOptionalString("value"),
          currency: defaultOptionalString("currency"),
          quantity: defaultOptionalString("quantity"),
          renewal_count: defaultOptionalString("renewal_count")
        },
        customParameters: {}
      };
    case MPEventType.DynamicLinkAppOpen:
      return {
        type: eventType,
        parameters: {
          source: defaultOptionalString("source"),
          medium: defaultOptionalString("medium"),
          campaign: defaultOptionalString("campaign"),
          link_id: defaultOptionalString("link_id"),
          accept_time: defaultOptionalString("accept_time")
        },
        customParameters: {}
      };
    case MPEventType.DynamicLinkAppUpdate:
      return {
        type: eventType,
        parameters: {
          source: defaultOptionalString("source"),
          medium: defaultOptionalString("medium"),
          campaign: defaultOptionalString("campaign"),
          link_id: defaultOptionalString("link_id"),
          accept_time: defaultOptionalString("accept_time")
        },
        customParameters: {}
      };
    case MPEventType.DynamicLinkFirstOpen:
      return {
        type: eventType,
        parameters: {
          source: defaultOptionalString("source"),
          medium: defaultOptionalString("medium"),
          campaign: defaultOptionalString("campaign"),
          link_id: defaultOptionalString("link_id"),
          accept_time: defaultOptionalString("accept_time")
        },
        customParameters: {}
      };
  }
};
