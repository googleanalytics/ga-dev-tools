import { OptionalString, Parameters } from "./parameters";
import { MPEventType } from "./index";

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

interface AddPaymentInfoEvent {
  type: MPEventType.AddPaymentInfo;
  parameters: {};
  customParameters: Parameters;
}
interface AddToCartEvent {
  type: MPEventType.AddToCart;
  parameters: {
    quantity: OptionalString;
    item_category: OptionalString;
    item_name: OptionalString;
    item_id: OptionalString;
    item_location_id: OptionalString;
    value: OptionalString;
    price: OptionalString;
    currency: OptionalString;
  };
  customParameters: Parameters;
}
interface AddToWishlistEvent {
  type: MPEventType.AddToWishlist;
  parameters: {
    quantity: OptionalString;
    item_category: OptionalString;
    item_name: OptionalString;
    item_id: OptionalString;
    item_location_id: OptionalString;
    value: OptionalString;
    price: OptionalString;
    currency: OptionalString;
  };
  customParameters: Parameters;
}
interface BeginCheckoutEvent {
  type: MPEventType.BeginCheckout;
  parameters: {
    coupon: OptionalString;
    currency: OptionalString;
    value: OptionalString;
  };
  customParameters: Parameters;
}
interface EcommercePurchaseEvent {
  type: MPEventType.EcommercePurchase;
  parameters: {
    coupon: OptionalString;
    currency: OptionalString;
    value: OptionalString;
    tax: OptionalString;
    shipping: OptionalString;
    transation_id: OptionalString;
  };
  customParameters: Parameters;
}
interface GenerateLeadEvent {
  type: MPEventType.GenerateLead;
  parameters: {
    value: OptionalString;
    currency: OptionalString;
  };
  customParameters: Parameters;
}
interface PurchaseRefundEvent {
  type: MPEventType.PurchaseRefund;
  parameters: {
    quantity: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    transaction_id: OptionalString;
  };
  customParameters: Parameters;
}
interface ViewItemEvent {
  type: MPEventType.ViewItem;
  parameters: { item_id: OptionalString; item_location_id: OptionalString };
  customParameters: Parameters;
}
interface ViewItemListEvent {
  type: MPEventType.ViewItemList;
  parameters: { item_category: OptionalString };
  customParameters: Parameters;
}
interface ViewSearchResultsEvent {
  type: MPEventType.ViewSearchResults;
  parameters: { search_term: OptionalString };
  customParameters: Parameters;
}
