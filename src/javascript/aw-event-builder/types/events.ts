export interface Item {
  parameters: {
    name: OptionalString;
  };
  customParameters: {};
}

export enum ParameterType {
  OptionalString = "optional string",
  OptionalNumber = "optional number",
  RequiredArray = "required array"
}

export type OptionalString = {
  type: ParameterType.OptionalString;
  required: false;
  value?: string;
  name: string;
};

export const defaultOptionalString = (name: string): OptionalString => ({
  type: ParameterType.OptionalString,
  required: false,
  value: "",
  name
});

export type ItemArray = {
  type: ParameterType.RequiredArray;
  required: true;
  value: Item[];
  name: string;
};

export const defaultItemArray = (name: string): ItemArray => ({
  type: ParameterType.RequiredArray,
  required: true,
  value: [],
  name
});

export type OptionalNumber = {
  type: ParameterType.OptionalNumber;
  required: false;
  value?: number;
  name: string;
};

export const defaultOptionalNumber = (name: string): OptionalNumber => ({
  type: ParameterType.OptionalNumber,
  required: false,
  value: undefined,
  name
});

export const defaultParameterFor = (
  type: ParameterType,
  name: string
): Parameter => {
  switch (type) {
    case ParameterType.RequiredArray:
      return defaultItemArray(name);
    case ParameterType.OptionalString:
      return defaultOptionalString(name);
    case ParameterType.OptionalNumber:
      return defaultOptionalNumber(name);
  }
};

export type Parameter = OptionalString | ItemArray | OptionalNumber;

export type Parameters = { [paramName: string]: Parameter };

// EVENTS start here
export enum MPEventType {
  CustomEvent = "custom_event",
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

export type MPEventData =
  | CustomEvent
  | EarnVirtualCurrencyEvent
  | JoinGroupEvent
  | LoginEvent
  | PresentOfferEvent
  | PurchaseEvent
  | RefundEvent
  | SearchEvent
  | SelectContentEvent
  | ShareEvent
  | SignUpEvent
  | SpendVirtualCurrencyEvent
  | TutorialBeginEvent
  | TutorialCompleteEvent
  | EarnVirtualCurrencyEvent;

// Events: Custom
interface CustomEvent {
  type: MPEventType.CustomEvent;
  parameters: {};
  customParameters: Parameters;
}

// Events: All Properties
interface EarnVirtualCurrencyEvent {
  type: MPEventType.EarnVirtualCurrency;
  parameters: { virtual_currency_name: OptionalString; value: OptionalString };
  customParameters: Parameters;
}
interface JoinGroupEvent {
  type: MPEventType.JoinGroup;
  parameters: { group_id: OptionalString };
  customParameters: Parameters;
}
interface LoginEvent {
  type: MPEventType.Login;
  parameters: { method: OptionalString };
  customParameters: Parameters;
}
interface PresentOfferEvent {
  type: MPEventType.PresentOffer;
  parameters: {
    item_id: OptionalString;
    item_name: OptionalString;
    item_category: OptionalString;
  };
  customParameters: Parameters;
}
interface PurchaseEvent {
  type: MPEventType.Purchase;
  parameters: {
    transactions_id: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    tax: OptionalString;
    shipping: OptionalString;
    items: ItemArray;
    coupon: OptionalString;
  };
  customParameters: Parameters;
}
interface RefundEvent {
  type: MPEventType.Refund;
  parameters: {
    transactions_id: OptionalString;
    value: OptionalString;
    currency: OptionalString;
    tax: OptionalString;
    shipping: OptionalString;
    items: ItemArray;
  };
  customParameters: Parameters;
}

interface SearchEvent {
  type: MPEventType.Search;
  parameters: { search_term: OptionalString };
  customParameters: Parameters;
}
interface SelectContentEvent {
  type: MPEventType.SelectContent;
  parameters: { content_type: OptionalString; item_id: OptionalString };
  customParameters: Parameters;
}
interface ShareEvent {
  type: MPEventType.Share;
  parameters: { content_type: OptionalString; item_id: OptionalString };
  customParameters: Parameters;
}
interface SignUpEvent {
  type: MPEventType.SignUp;
  parameters: { method: OptionalString };
  customParameters: Parameters;
}
interface SpendVirtualCurrencyEvent {
  type: MPEventType.SpendVirtualCurrency;
  parameters: {
    item_name: OptionalString;
    virtual_currency_name: OptionalString;
    value: OptionalString;
  };
  customParameters: Parameters;
}
interface TutorialBeginEvent {
  type: MPEventType.TutorialBegin;
  parameters: {};
  customParameters: Parameters;
}
interface TutorialCompleteEvent {
  type: MPEventType.TutorialComplete;
  parameters: {};
  customParameters: Parameters;
}

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
