import { MPEventType, MPEventData, emptyEvent } from "./events";
// TODO - this type should be an A | B type where the options are based on OptionalString | RequiredString ...
// Narrowing should be possible through 'type' & 'required'.
export type EventParameter = {
  parameterType: "string" | "number";
  parameterName: string;
  parameterValue?: string;
  required: boolean;
};

export class MPEvent {
  private eventType: MPEventType;
  private eventData: MPEventData;

  static options = (): MPEventType[] => {
    return Object.values(MPEventType);
  };

  static empty = (eventType: MPEventType) => {
    return new MPEvent(eventType, emptyEvent(eventType));
  };

  static default = () => {
    return MPEvent.empty(MPEventType.PageView);
  };

  constructor(eventType: MPEventType, eventData: MPEventData) {
    this.eventType = eventType;
    this.eventData = eventData;
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
