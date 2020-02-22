export enum MPEventType {
  CampaignEvent = "campaign-event",
  PageView = "page-view"
}

interface PageViewEvent {
  type: MPEventType.PageView;
}

type OptionalString = {
  type: "string";
  required: false;
  value?: string;
};

type RequiredString = {
  type: "string";
  required: true;
  value: string;
};

interface CampaignEvent {
  type: MPEventType.CampaignEvent;
  // TODO figure out what's actually required or not.
  source: RequiredString;
  medium: OptionalString;
  name: OptionalString;
  term: OptionalString;
  content: OptionalString;
  id: OptionalString;
}

type MPEventData = CampaignEvent | PageViewEvent;

// TODO - this type should be an A | B type where the options are based on OptionalString | RequiredString ...
// Narrowing should be possible through 'type' & 'required'.
export type EventParameter = {
  parameterType: "string" | "number";
  parameterName: string;
  parameterValue?: string;
  required: boolean;
};

type Optional<T> = { [K in keyof T]: T[K] };

const optionalForEventType = (
  eventType: MPEventType
): Optional<MPEventData> => {
  switch (eventType) {
    case MPEventType.CampaignEvent:
      return {
        type: eventType,
        source: { type: "string", required: true, value: "" },
        medium: { type: "string", required: false, value: "" },
        name: { type: "string", required: false, value: "" },
        term: { type: "string", required: false, value: "" },
        content: { type: "string", required: false, value: "" },
        id: { type: "string", required: false, value: "" }
      };
    case MPEventType.PageView:
      return { type: eventType };
  }
};

export class MPEvent {
  private eventType: MPEventType;
  private eventData: Optional<MPEventData>;

  static options = (): MPEventType[] => {
    return Object.values(MPEventType);
  };

  static empty = (eventType: MPEventType) => {
    return new MPEvent(eventType, optionalForEventType(eventType));
  };

  static default = () => {
    return MPEvent.empty(MPEventType.PageView);
  };

  constructor(eventType: MPEventType, eventData: Optional<MPEventData>) {
    this.eventType = eventType;
    this.eventData = eventData;
  }

  private clone(): MPEvent {
    return { ...this };
  }

  getEventType(): MPEventType {
    return this.eventType;
  }

  updateParameter(parameterName: string, newValue: any): MPEvent {
    const nuData = { ...this.eventData };
    // TODO - maybe there's a better way to typecheck this?
    const parameter = nuData[parameterName];
    parameter.value = newValue;
    return new MPEvent(this.eventType, nuData);
  }

  getParameters(): EventParameter[] {
    return Object.entries(this.eventData)
      .filter(([key]) => {
        return key !== "type";
      })
      .filter(([, value]) => {
        return typeof value === "object" && value.type !== undefined;
      })
      .map(([key, value]) => {
        // TODO - see if I can't add in some better types here. This is mostly any.
        console.log({ value });
        const eventParameter: EventParameter = {
          parameterName: key,
          parameterValue: value.value,
          parameterType: value.type,
          required: value.required
        };
        return eventParameter;
      });
  }
}
