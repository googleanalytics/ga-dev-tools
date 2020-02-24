type OptionalNumber = {
  type: "number";
  required: false;
  value?: number;
};

type OptionalString = {
  type: "string";
  required: false;
  value?: string;
};

export const defaultOptionalString = (): OptionalString => ({
  type: "string",
  required: false,
  value: ""
});

type RequiredString = {
  type: "string";
  required: true;
  value: string;
};

type OptionalArray<T> = {
  type: "array";
  required: false;
  value?: T[];
};

export type Parameter =
  | OptionalString
  | RequiredString
  | OptionalNumber
  | OptionalArray<any>;

export type Parameters = { [paramName: string]: Parameter };

// EVENTS start here
export enum MPEventType {
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
    items: OptionalString;
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
    items: OptionalString;
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
    case MPEventType.EarnVirtualCurrency:
      return {
        type: eventType,
        parameters: {
          virtual_currency_name: defaultOptionalString(),
          value: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.JoinGroup:
      return {
        type: eventType,
        parameters: { group_id: defaultOptionalString() },
        customParameters: {}
      };
    case MPEventType.Login:
      return {
        type: eventType,
        parameters: { method: defaultOptionalString() },
        customParameters: {}
      };
    case MPEventType.PresentOffer:
      return {
        type: eventType,
        parameters: {
          item_id: defaultOptionalString(),
          item_name: defaultOptionalString(),
          item_category: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.Purchase:
      return {
        type: eventType,
        parameters: {
          transactions_id: defaultOptionalString(),
          value: defaultOptionalString(),
          currency: defaultOptionalString(),
          tax: defaultOptionalString(),
          shipping: defaultOptionalString(),
          items: defaultOptionalString(),
          coupon: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.Refund:
      return {
        type: eventType,
        parameters: {
          transactions_id: defaultOptionalString(),
          value: defaultOptionalString(),
          currency: defaultOptionalString(),
          tax: defaultOptionalString(),
          shipping: defaultOptionalString(),
          items: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.Search:
      return {
        type: eventType,
        parameters: { search_term: defaultOptionalString() },
        customParameters: {}
      };
    case MPEventType.SelectContent:
      return {
        type: eventType,
        parameters: {
          content_type: defaultOptionalString(),
          item_id: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.Share:
      return {
        type: eventType,
        parameters: {
          content_type: defaultOptionalString(),
          item_id: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.SignUp:
      return {
        type: eventType,
        parameters: { method: defaultOptionalString() },
        customParameters: {}
      };
    case MPEventType.SpendVirtualCurrency:
      return {
        type: eventType,
        parameters: {
          virtual_currency_name: defaultOptionalString(),
          value: defaultOptionalString(),
          item_name: defaultOptionalString()
        },
        customParameters: {}
      };
    case MPEventType.TutorialBegin:
      return { type: eventType, parameters: {}, customParameters: {} };
    case MPEventType.TutorialComplete:
      return { type: eventType, parameters: {}, customParameters: {} };
  }
};
