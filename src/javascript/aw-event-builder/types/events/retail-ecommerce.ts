import { OptionalString } from "./parameters";
import { MPEventType, EventData } from "./index";

export type RetailEcommerceEvent =
  | AddPaymentInfoEvent
  | AddToCartEvent
  | AddToWishlistEvent
  | BeginCheckoutEvent
  | EcommercePurchaseEvent
  | GenerateLeadEvent
  | PurchaseRefundEvent
  | ViewItemEvent
  | ViewItemListEvent
  | ViewSearchResultsEvent;

type AddPaymentInfoEvent = EventData<MPEventType.AddPaymentInfo, never>;
type AddToCartEvent = EventData<
  MPEventType.AddToCart,
  | OptionalString<"quantity">
  | OptionalString<"item_category">
  | OptionalString<"item_name">
  | OptionalString<"item_id">
  | OptionalString<"item_location_id">
  | OptionalString<"value">
  | OptionalString<"price">
  | OptionalString<"currency">
>;
type AddToWishlistEvent = EventData<
  MPEventType.AddToWishlist,
  | OptionalString<"quantity">
  | OptionalString<"item_category">
  | OptionalString<"item_name">
  | OptionalString<"item_id">
  | OptionalString<"item_location_id">
  | OptionalString<"value">
  | OptionalString<"price">
  | OptionalString<"currency">
>;
type BeginCheckoutEvent = EventData<
  MPEventType.BeginCheckout,
  | OptionalString<"coupon">
  | OptionalString<"currency">
  | OptionalString<"value">
>;
type EcommercePurchaseEvent = EventData<
  MPEventType.EcommercePurchase,
  | OptionalString<"coupon">
  | OptionalString<"currency">
  | OptionalString<"value">
  | OptionalString<"tax">
  | OptionalString<"shipping">
  | OptionalString<"transation_id">
>;
type GenerateLeadEvent = EventData<
  MPEventType.GenerateLead,
  OptionalString<"value"> | OptionalString<"currency">
>;
type PurchaseRefundEvent = EventData<
  MPEventType.PurchaseRefund,
  | OptionalString<"quantity">
  | OptionalString<"value">
  | OptionalString<"currency">
  | OptionalString<"transaction_id">
>;
type ViewItemEvent = EventData<
  MPEventType.ViewItem,
  OptionalString<"item_id"> | OptionalString<"item_location_id">
>;
type ViewItemListEvent = EventData<
  MPEventType.ViewItemList,
  OptionalString<"item_category">
>;
type ViewSearchResultsEvent = EventData<
  MPEventType.ViewSearchResults,
  OptionalString<"search_term">
>;
