import { StringParam } from "./parameters";
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
  | StringParam<"quantity">
  | StringParam<"item_category">
  | StringParam<"item_name">
  | StringParam<"item_id">
  | StringParam<"item_location_id">
  | StringParam<"value">
  | StringParam<"price">
  | StringParam<"currency">
>;
type AddToWishlistEvent = EventData<
  MPEventType.AddToWishlist,
  | StringParam<"quantity">
  | StringParam<"item_category">
  | StringParam<"item_name">
  | StringParam<"item_id">
  | StringParam<"item_location_id">
  | StringParam<"value">
  | StringParam<"price">
  | StringParam<"currency">
>;
type BeginCheckoutEvent = EventData<
  MPEventType.BeginCheckout,
  StringParam<"coupon"> | StringParam<"currency"> | StringParam<"value">
>;
type EcommercePurchaseEvent = EventData<
  MPEventType.EcommercePurchase,
  | StringParam<"coupon">
  | StringParam<"currency">
  | StringParam<"value">
  | StringParam<"tax">
  | StringParam<"shipping">
  | StringParam<"transaction_id">
>;
type GenerateLeadEvent = EventData<
  MPEventType.GenerateLead,
  StringParam<"value"> | StringParam<"currency">
>;
type PurchaseRefundEvent = EventData<
  MPEventType.PurchaseRefund,
  StringParam<"value"> | StringParam<"currency"> | StringParam<"transaction_id">
>;
type ViewItemEvent = EventData<
  MPEventType.ViewItem,
  StringParam<"item_id"> | StringParam<"item_location_id">
>;
type ViewItemListEvent = EventData<
  MPEventType.ViewItemList,
  StringParam<"item_category">
>;
type ViewSearchResultsEvent = EventData<
  MPEventType.ViewSearchResults,
  StringParam<"search_term">
>;
