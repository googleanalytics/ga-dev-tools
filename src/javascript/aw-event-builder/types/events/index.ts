import { Parameters, SuggestedParameters, Parameter } from "./parameters";
import { AllAppsEvent } from "./all-apps";
import { RetailEcommerceEvent } from "./retail-ecommerce";
import { GamesEvent } from "./games";
import { AutomaticEvent } from "./automatic";

export * from "./parameters";
export * from "./empty-event";

export enum MPEventCategory {
  Custom = "Custom",
  AllApps = "All apps",
  RetailEcommerce = "Retail/Ecommerce",
  Jobs_Edu_LocalDeails_RealEstate = "Jobs, Education, Local Deals, Real Estate",
  Travel = "Travel (Hotel/Air)",
  Games = "Games",
  Automatic = "Automatically collected events"
}

export enum MPEventType {
  // Custom Event
  CustomEvent = "custom_event",

  // All Apps
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
  EarnVirtualCurrency = "earn_virtual_currency",
  TutorialBegin = "tutorial_begin",
  TutorialComplete = "tutorial_complete",

  // Retail/Ecommerce
  // https://support.google.com/firebase/answer/6317499?hl=en&ref_topic=6317484
  AddPaymentInfo = "add_payment_info",
  AddToCart = "add_to_cart",
  AddToWishlist = "add_to_wishlist",
  BeginCheckout = "begin_checkout",
  EcommercePurchase = "ecommerce_purchase",
  GenerateLead = "generate_lead",
  PurchaseRefund = "purchase_refund",
  ViewItem = "view_item",
  ViewItemList = "view_item_list",
  ViewSearchResults = "view_search_results",

  // Jobs, Education, Local Deals, Real Estate (currently identical to Retail/Ecommerce)
  // https://support.google.com/firebase/answer/6375140?hl=en&ref_topic=6317484

  // Travel (Hotel/Air) - same as Retail/Ecommerce + Search
  // https://support.google.com/firebase/answer/6317508?hl=en&ref_topic=6317484

  // Games
  // https://support.google.com/firebase/answer/6317494?hl=en&ref_topic=6317484
  LevelUp = "level_up",
  PostScore = "post_score",
  UnlockAchievement = "unlock_achievement",

  // Automatically collected events
  // https://support.google.com/firebase/answer/6317485?hl=en&ref_topic=6317484
  AdReward = "ad_reward",
  AppException = "app_exception",
  AppStoreRefund = "app_store_refund",
  AppStoreSubscriptionCancel = "app_store_subscription_cancel",
  AppStoreSubscriptionConvert = "app_store_subscription_convert",
  AppStoreSubscriptionRenew = "app_store_subscription_renew",
  DynamicLinkAppOpen = "dynamic_link_app_open",
  DynamicLinkAppUpdate = "dynamic_link_app_update",
  DynamicLinkFirstOpen = "dynamic_link_first_open"
}

// This just saves on some typing. EventType & Suggested are generic variables
// with names to try to make this more intention revealing.
export type EventData<EventType, Suggested extends Parameter> = {
  type: EventType;
  parameters: SuggestedParameters<Suggested>;
};

// Events: Custom
type CustomEvent = EventData<MPEventType.CustomEvent, never>;

export type MPEventData =
  | CustomEvent
  | AllAppsEvent
  | RetailEcommerceEvent
  | GamesEvent
  | AutomaticEvent;

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
    case MPEventCategory.Travel:
      return [
        MPEventType.AddPaymentInfo,
        MPEventType.AddToCart,
        MPEventType.AddToWishlist,
        MPEventType.BeginCheckout,
        MPEventType.EcommercePurchase,
        MPEventType.GenerateLead,
        MPEventType.Purchase,
        MPEventType.PurchaseRefund,
        MPEventType.Search,
        MPEventType.ViewItem,
        MPEventType.ViewItemList,
        MPEventType.ViewSearchResults
      ];
    case MPEventCategory.Games:
      return [
        MPEventType.EarnVirtualCurrency,
        MPEventType.JoinGroup,
        MPEventType.LevelUp,
        MPEventType.PostScore,
        MPEventType.SelectContent,
        MPEventType.SpendVirtualCurrency,
        MPEventType.TutorialBegin,
        MPEventType.TutorialComplete,
        MPEventType.UnlockAchievement
      ];
    case MPEventCategory.Automatic:
      return [
        MPEventType.AdReward,
        MPEventType.AppException,
        MPEventType.AppStoreRefund,
        MPEventType.AppStoreSubscriptionCancel,
        MPEventType.AppStoreSubscriptionConvert,
        MPEventType.AppStoreSubscriptionRenew,
        MPEventType.DynamicLinkAppOpen,
        MPEventType.DynamicLinkAppUpdate,
        MPEventType.DynamicLinkFirstOpen
      ];
  }
};
