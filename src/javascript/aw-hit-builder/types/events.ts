type OptionalNumber = {
  type: "number";
  required: false;
  value?: number;
};

const defaultOptionalNumber = (): OptionalNumber => ({
  type: "number",
  required: false,
  value: undefined
});

type OptionalString = {
  type: "string";
  required: false;
  value?: string;
};

const defaultOptionalString = (): OptionalString => ({
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

const defaultOptionalArray = (): OptionalArray<any> => ({
  type: "array",
  required: false,
  value: undefined
});

export const emptyEvent = (eventType: MPEventType): MPEventData => {
  switch (eventType) {
    case MPEventType.AddToCart:
      return {
        type: eventType,
        coupon: defaultOptionalString(),
        currency: defaultOptionalString(),
        items: defaultOptionalArray(),
        value: defaultOptionalNumber()
      };
    // case MPEventType.CampaignEvent:
    //   return {
    //     type: eventType,
    //     source: { type: "string", required: true, value: "" },
    //     medium: { type: "string", required: false, value: "" },
    //     name: { type: "string", required: false, value: "" },
    //     term: { type: "string", required: false, value: "" },
    //     content: { type: "string", required: false, value: "" },
    //     id: { type: "string", required: false, value: "" }
    //   };
    case MPEventType.AddPaymentInfo:
      return { type: eventType };
    case MPEventType.PageView:
      return { type: eventType };
  }
};

// EVENTS start here
export enum MPEventType {
  AddToCart = "Add To Cart",
  AddPaymentInfo = "Add Payment Info",
  // CampaignEvent = "Campaign Event",
  PageView = "Page View"
}

export type MPEventData =
  | AddToCardEvent
  // | CampaignEvent
  | PageViewEvent
  | AddPaymentInfoEvent;

interface AddToCardEvent {
  type: MPEventType.AddToCart;
  coupon: OptionalString;
  currency: OptionalString;
  // TODO - figure out how the items type should be handled.
  items: OptionalArray<any>;
  value: OptionalNumber;
}

interface AddPaymentInfoEvent {
  type: MPEventType.AddPaymentInfo;
}

// interface CampaignEvent {
//   type: MPEventType.CampaignEvent;
//   // TODO figure out what's actually required or not.
//   source: RequiredString;
//   medium: OptionalString;
//   name: OptionalString;
//   term: OptionalString;
//   content: OptionalString;
//   id: OptionalString;
// }

interface PageViewEvent {
  type: MPEventType.PageView;
}
