import { defaultItemArrayParam, defaultStringParam } from "./parameters";
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
          defaultStringParam("virtual_currency_name"),
          defaultStringParam("value")
        ]
      };
    case MPEventType.JoinGroup:
      return {
        type: eventType,
        parameters: [defaultStringParam("group_id")]
      };
    case MPEventType.Login:
      return {
        type: eventType,
        parameters: [defaultStringParam("method")]
      };
    case MPEventType.PresentOffer:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("item_id"),
          defaultStringParam("item_name"),
          defaultStringParam("item_category")
        ]
      };
    case MPEventType.Purchase:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("transactions_id"),
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("tax"),
          defaultStringParam("shipping"),
          defaultItemArrayParam(),
          defaultStringParam("coupon"),
          defaultStringParam("affiliation")
        ]
      };
    case MPEventType.Refund:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("transactions_id"),
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("tax"),
          defaultStringParam("shipping"),
          defaultItemArrayParam()
        ]
      };
    case MPEventType.Search:
      return {
        type: eventType,
        parameters: [defaultStringParam("search_term")]
      };
    case MPEventType.SelectContent:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("content_type"),
          defaultStringParam("item_id")
        ]
      };
    case MPEventType.Share:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("content_type"),
          defaultStringParam("item_id")
        ]
      };
    case MPEventType.SignUp:
      return {
        type: eventType,
        parameters: [defaultStringParam("method")]
      };
    case MPEventType.SpendVirtualCurrency:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("virtual_currency_name"),
          defaultStringParam("value"),
          defaultStringParam("item_name")
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
          defaultStringParam("quantity"),
          defaultStringParam("item_category"),
          defaultStringParam("item_name"),
          defaultStringParam("item_id"),
          defaultStringParam("item_location_id"),
          defaultStringParam("value"),
          defaultStringParam("price"),
          defaultStringParam("currency")
        ]
      };
    case MPEventType.AddToWishlist:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("quantity"),
          defaultStringParam("item_category"),
          defaultStringParam("item_name"),
          defaultStringParam("item_id"),
          defaultStringParam("item_location_id"),
          defaultStringParam("value"),
          defaultStringParam("price"),
          defaultStringParam("currency")
        ]
      };
    case MPEventType.BeginCheckout:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("coupon"),
          defaultStringParam("currency"),
          defaultStringParam("value")
        ]
      };
    case MPEventType.EcommercePurchase:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("coupon"),
          defaultStringParam("currency"),
          defaultStringParam("value"),
          defaultStringParam("tax"),
          defaultStringParam("shipping"),
          defaultStringParam("transaction_id")
        ]
      };
    case MPEventType.GenerateLead:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("value"),
          defaultStringParam("currency")
        ]
      };
    case MPEventType.PurchaseRefund:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("transaction_id")
        ]
      };
    case MPEventType.ViewItem:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("item_id"),
          defaultStringParam("item_location_id")
        ]
      };
    case MPEventType.ViewItemList:
      return {
        type: eventType,
        parameters: [defaultStringParam("item_category")]
      };
    case MPEventType.ViewSearchResults:
      return {
        type: eventType,
        parameters: [defaultStringParam("search_term")]
      };
    case MPEventType.LevelUp:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("character"),
          defaultStringParam("level")
        ]
      };
    case MPEventType.PostScore:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("level"),
          defaultStringParam("character"),
          defaultStringParam("score")
        ]
      };
    case MPEventType.UnlockAchievement:
      return {
        type: eventType,
        parameters: [defaultStringParam("achievement_id")]
      };
    case MPEventType.AdReward:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("ad_unit_id"),
          defaultStringParam("reward_type"),
          defaultStringParam("reward_value")
        ]
      };
    case MPEventType.AppException:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("fatal"),
          defaultStringParam("timestamp")
        ]
      };
    case MPEventType.AppStoreRefund:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("product_id"),
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("quantity")
        ]
      };
    case MPEventType.AppStoreSubscriptionCancel:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("product_id"),
          defaultStringParam("price"),
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("cancellation_reason")
        ]
      };
    case MPEventType.AppStoreSubscriptionConvert:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("product_id"),
          defaultStringParam("price"),
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("quantity")
        ]
      };
    case MPEventType.AppStoreSubscriptionRenew:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("product_id"),
          defaultStringParam("price"),
          defaultStringParam("value"),
          defaultStringParam("currency"),
          defaultStringParam("quantity"),
          defaultStringParam("renewal_count")
        ]
      };
    case MPEventType.DynamicLinkAppOpen:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("source"),
          defaultStringParam("medium"),
          defaultStringParam("campaign"),
          defaultStringParam("link_id"),
          defaultStringParam("accept_time")
        ]
      };
    case MPEventType.DynamicLinkAppUpdate:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("source"),
          defaultStringParam("medium"),
          defaultStringParam("campaign"),
          defaultStringParam("link_id"),
          defaultStringParam("accept_time")
        ]
      };
    case MPEventType.DynamicLinkFirstOpen:
      return {
        type: eventType,
        parameters: [
          defaultStringParam("source"),
          defaultStringParam("medium"),
          defaultStringParam("campaign"),
          defaultStringParam("link_id"),
          defaultStringParam("accept_time")
        ]
      };
  }
};
