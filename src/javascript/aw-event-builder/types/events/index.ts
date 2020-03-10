import { Parameters } from "./parameters";
import { AllAppsEvent } from "./all-apps";
import { RetailEcommerceEvent } from "./retail-ecommerce";

export * from "./parameters";
export * from "./empty-event";

export enum MPEventCategory {
  Custom = "Custom",
  AllApps = "All apps",
  RetailEcommerce = "Retail/Ecommerce",
  Jobs_Edu_LocalDeails_RealEstate = "Jobs, Education, Local Deals, Real Estate"
}

export enum MPEventType {
  // Custom Event
  CustomEvent = "custom_event",
  // All Apps
  EarnVirtualCurrency = "earn_virtual_currency",
  JoinGroup = "join_group",
  Login = "login",
  PresentOffer = "present_offer",
  // Also Retail/Ecommerce
  Purchase = "purchase",
  Refund = "refund",
  Search = "search",
  SelectContent = "select_content",
  Share = "share",
  SignUp = "sign_up",
  SpendVirtualCurrency = "spend_virtual_currency",
  TutorialBegin = "tutorial_begin",
  TutorialComplete = "tutorial_complete",
  // Retail/Ecommerce
  // https://support.google.com/firebase/answer/6317499?hl=en&ref_topic=6317484
  // and (they are currently the same)
  // Jobs, Education, Local Deals, Real Estate
  // https://support.google.com/firebase/answer/6375140?hl=en&ref_topic=6317484
  AddPaymentInfo = "add_payment_info",
  AddToCart = "add_to_cart",
  AddToWishlist = "add_to_wishlist",
  BeginCheckout = "begin_checkout",
  EcommercePurchase = "ecommerce_purchase",
  GenerateLead = "generate_lead",
  PurchaseRefund = "purchase_refund",
  ViewItem = "view_item",
  ViewItemList = "view_item_list",
  ViewSearchResults = "view_search_results"
}

// Events: Custom
interface CustomEvent {
  type: MPEventType.CustomEvent;
  parameters: {};
  customParameters: Parameters;
}

export type MPEventData = CustomEvent | AllAppsEvent | RetailEcommerceEvent;

export const eventTypesFor = (category: MPEventCategory): MPEventType[] => {
  switch (category) {
    case MPEventCategory.Custom:
      return [MPEventType.CustomEvent];
    case MPEventCategory.AllApps:
      return [
        MPEventType.EarnVirtualCurrency,
        MPEventType.JoinGroup,
        MPEventType.Login,
        MPEventType.PresentOffer,
        MPEventType.Purchase,
        MPEventType.Refund,
        MPEventType.Search,
        MPEventType.SelectContent,
        MPEventType.Share,
        MPEventType.SignUp,
        MPEventType.SpendVirtualCurrency,
        MPEventType.TutorialBegin,
        MPEventType.TutorialComplete
      ];
    case MPEventCategory.RetailEcommerce:
      return [
        MPEventType.AddPaymentInfo,
        MPEventType.AddToCart,
        MPEventType.AddToWishlist,
        MPEventType.BeginCheckout,
        MPEventType.EcommercePurchase,
        MPEventType.GenerateLead,
        MPEventType.Purchase,
        MPEventType.PurchaseRefund,
        MPEventType.ViewItem,
        MPEventType.ViewItemList,
        MPEventType.ViewSearchResults
      ];
    case MPEventCategory.Jobs_Edu_LocalDeails_RealEstate:
      return [
        MPEventType.AddPaymentInfo,
        MPEventType.AddToCart,
        MPEventType.AddToWishlist,
        MPEventType.BeginCheckout,
        MPEventType.EcommercePurchase,
        MPEventType.GenerateLead,
        MPEventType.Purchase,
        MPEventType.PurchaseRefund,
        MPEventType.ViewItem,
        MPEventType.ViewItemList,
        MPEventType.ViewSearchResults
      ];
  }
};
