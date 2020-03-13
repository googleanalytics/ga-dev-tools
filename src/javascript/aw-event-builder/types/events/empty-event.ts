import { defaultItemArray, defaultOptionalString } from "./parameters";
import { MPEventType, MPEventData } from "./index";

export const emptyEvent = (eventType: MPEventType): MPEventData => {
  switch (eventType) {
    case MPEventType.CustomEvent:
      return {
        type: eventType,
        parameters: []
      };
    case MPEventType.EarnVirtualCurrency:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("virtual_currency_name"),
          defaultOptionalString("value")
        ]
      };
    case MPEventType.JoinGroup:
      return {
        type: eventType,
        parameters: [defaultOptionalString("group_id")]
      };
    case MPEventType.Login:
      return {
        type: eventType,
        parameters: [defaultOptionalString("method")]
      };
    case MPEventType.PresentOffer:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("item_id"),
          defaultOptionalString("item_name"),
          defaultOptionalString("item_category")
        ]
      };
    case MPEventType.Purchase:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("transactions_id"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("tax"),
          defaultOptionalString("shipping"),
          defaultItemArray(),
          defaultOptionalString("coupon"),
          defaultOptionalString("appiliation")
        ]
      };
    case MPEventType.Refund:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("transactions_id"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("tax"),
          defaultOptionalString("shipping"),
          defaultItemArray()
        ]
      };
    case MPEventType.Search:
      return {
        type: eventType,
        parameters: [defaultOptionalString("search_term")]
      };
    case MPEventType.SelectContent:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("content_type"),
          defaultOptionalString("item_id")
        ]
      };
    case MPEventType.Share:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("content_type"),
          defaultOptionalString("item_id")
        ]
      };
    case MPEventType.SignUp:
      return {
        type: eventType,
        parameters: [defaultOptionalString("method")]
      };
    case MPEventType.SpendVirtualCurrency:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("virtual_currency_name"),
          defaultOptionalString("value"),
          defaultOptionalString("item_name")
        ]
      };
    case MPEventType.TutorialBegin:
      return { type: eventType, parameters: [] };
    case MPEventType.TutorialComplete:
      return { type: eventType, parameters: [] };

    // Retail Ecommerce
    case MPEventType.AddPaymentInfo:
      return { type: eventType, parameters: [] };
    case MPEventType.AddToCart:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("quantity"),
          defaultOptionalString("item_category"),
          defaultOptionalString("item_name"),
          defaultOptionalString("item_id"),
          defaultOptionalString("item_location_id"),
          defaultOptionalString("value"),
          defaultOptionalString("price"),
          defaultOptionalString("currency")
        ]
      };
    case MPEventType.AddToWishlist:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("quantity"),
          defaultOptionalString("item_category"),
          defaultOptionalString("item_name"),
          defaultOptionalString("item_id"),
          defaultOptionalString("item_location_id"),
          defaultOptionalString("value"),
          defaultOptionalString("price"),
          defaultOptionalString("currency")
        ]
      };
    case MPEventType.BeginCheckout:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("coupon"),
          defaultOptionalString("currency"),
          defaultOptionalString("value")
        ]
      };
    case MPEventType.EcommercePurchase:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("coupon"),
          defaultOptionalString("currency"),
          defaultOptionalString("value"),
          defaultOptionalString("tax"),
          defaultOptionalString("shipping"),
          defaultOptionalString("transation_id")
        ]
      };
    case MPEventType.GenerateLead:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("value"),
          defaultOptionalString("currency")
        ]
      };
    case MPEventType.PurchaseRefund:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("quantity"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("transaction_id")
        ]
      };
    case MPEventType.ViewItem:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("item_id"),
          defaultOptionalString("item_location_id")
        ]
      };
    case MPEventType.ViewItemList:
      return {
        type: eventType,
        parameters: [defaultOptionalString("item_category")]
      };
    case MPEventType.ViewSearchResults:
      return {
        type: eventType,
        parameters: [defaultOptionalString("search_term")]
      };
    case MPEventType.LevelUp:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("character"),
          defaultOptionalString("level")
        ]
      };
    case MPEventType.PostScore:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("level"),
          defaultOptionalString("character"),
          defaultOptionalString("score")
        ]
      };
    case MPEventType.UnlockAchievement:
      return {
        type: eventType,
        parameters: [defaultOptionalString("achievement_id")]
      };
    case MPEventType.AdExposure:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("firebase_screen"),
          defaultOptionalString("firebase_screen_id"),
          defaultOptionalString("firebase_screen_class"),
          defaultOptionalString("exposure_time")
        ]
      };
    case MPEventType.AdReward:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("ad_unit_id"),
          defaultOptionalString("reward_type"),
          defaultOptionalString("reward_value")
        ]
      };
    case MPEventType.AppException:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("fatal"),
          defaultOptionalString("timestamp")
        ]
      };
    case MPEventType.AppStoreRefund:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("product_id"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("quantity")
        ]
      };
    case MPEventType.AppStoreSubscriptionCancel:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("product_id"),
          defaultOptionalString("price"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("cancellation_reason")
        ]
      };
    case MPEventType.AppStoreSubscriptionConvert:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("product_id"),
          defaultOptionalString("price"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("quantity")
        ]
      };
    case MPEventType.AppStoreSubscriptionRenew:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("product_id"),
          defaultOptionalString("price"),
          defaultOptionalString("value"),
          defaultOptionalString("currency"),
          defaultOptionalString("quantity"),
          defaultOptionalString("renewal_count")
        ]
      };
    case MPEventType.DynamicLinkAppOpen:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("source"),
          defaultOptionalString("medium"),
          defaultOptionalString("campaign"),
          defaultOptionalString("link_id"),
          defaultOptionalString("accept_time")
        ]
      };
    case MPEventType.DynamicLinkAppUpdate:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("source"),
          defaultOptionalString("medium"),
          defaultOptionalString("campaign"),
          defaultOptionalString("link_id"),
          defaultOptionalString("accept_time")
        ]
      };
    case MPEventType.DynamicLinkFirstOpen:
      return {
        type: eventType,
        parameters: [
          defaultOptionalString("source"),
          defaultOptionalString("medium"),
          defaultOptionalString("campaign"),
          defaultOptionalString("link_id"),
          defaultOptionalString("accept_time")
        ]
      };
  }
};
