import { MPEventType, MPEventData, emptyEvent, Parameter } from "./events";
// TODO - this type should be an A | B type where the options are based on OptionalString | RequiredString ...
// Narrowing should be possible through 'type' & 'required'.
export type EventParameter = {
  parameterType: "string" | "number" | "array";
  parameterName: string;
  parameterValue?: string | number | any[];
  required: boolean;
};

export class MPEvent {
  private eventType: MPEventType;
  private eventData: MPEventData;

  static options = (): MPEventType[] => {
    return Object.values(MPEventType);
  };

  static eventTypeFromString = (eventType: string): MPEventType | undefined => {
    const assumed: MPEventType = eventType as MPEventType;
    switch (assumed) {
      case MPEventType.EarnVirtualCurrency:
      case MPEventType.JoinGroup:
      case MPEventType.Login:
      case MPEventType.PresentOffer:
      case MPEventType.Purchase:
      case MPEventType.Refund:
      case MPEventType.Search:
      case MPEventType.SelectContent:
      case MPEventType.Share:
      case MPEventType.SignUp:
      case MPEventType.SpendVirtualCurrency:
      case MPEventType.TutorialBegin:
      case MPEventType.TutorialComplete:
        return assumed;
    }
    return undefined;
  };

  static empty = (eventType: MPEventType) => {
    return new MPEvent(eventType, emptyEvent(eventType));
  };

  static default = () => {
    return MPEvent.empty(MPEventType.SelectContent);
  };

  constructor(eventType: MPEventType, eventData: MPEventData) {
    this.eventType = eventType;
    this.eventData = eventData;
  }

  getEventData(): MPEventData {
    return this.eventData;
  }

  getEventType(): MPEventType {
    return this.eventType;
  }

  asPayload(): {} {
    return this.getParameters()
      .concat(this.getCustomParameters())
      .reduce((payload, parameter) => {
        payload[parameter.parameterName] = parameter.parameterValue;
        return payload;
      }, {});
  }

  updateParameter(parameterName: string, newValue: any): MPEvent {
    const nuData = { ...this.eventData };
    // TODO - maybe there's a better way to typecheck this?
    // probably if I required the parameter type to be passed in. Then I could do a switch and make sure that the parameter Name exists.
    if (parameterName in nuData.parameters) {
      const parameter = nuData.parameters[parameterName];
      parameter.value = newValue;
      return new MPEvent(this.eventType, nuData);
    } else {
      throw new Error(
        `${parameterName} is not a parameter in ${this.eventType}`
      );
    }
  }
  updateCustomParameter(parameterName: string, newValue: any): MPEvent {
    const nuData = { ...this.eventData };
    if (parameterName in nuData.customParameters) {
      const parameter = nuData.customParameters[parameterName];
      parameter.value = newValue;
      return new MPEvent(this.eventType, nuData);
    } else {
      throw new Error(
        `${parameterName} is not a custom parameter in ${this.eventType}`
      );
    }
  }

  getParameters(): EventParameter[] {
    return Object.entries<Parameter>(this.eventData.parameters).map(
      ([key, parameter]) => {
        const eventParameter: EventParameter = {
          parameterName: key,
          parameterValue: parameter.value,
          parameterType: parameter.type,
          required: parameter.required
        };
        return eventParameter;
      }
    );
  }
  getCustomParameters(): EventParameter[] {
    return Object.entries<Parameter>(this.eventData.customParameters).map(
      ([key, parameter]) => {
        const eventParameter: EventParameter = {
          parameterName: key,
          parameterValue: parameter.value,
          parameterType: parameter.type,
          required: parameter.required
        };
        return eventParameter;
      }
    );
  }
  addCustomParameter(parameterName: string, parameter: Parameter): MPEvent {
    const nuData = { ...this.eventData };
    nuData.customParameters[parameterName] = parameter;
    return new MPEvent(this.eventType, nuData);
  }
  removeCustomParameter(parameterName: string): MPEvent {
    const nuData = { ...this.eventData };
    delete nuData.customParameters[parameterName];
    return new MPEvent(this.eventType, nuData);
  }
  updateCustomParameterName(parameterName: string, newName: string): MPEvent {
    console.log({ parameterName, newName });
    const nuData = { ...this.eventData };
    // Copy the old parameter value into the new name.
    nuData.customParameters[newName] = nuData.customParameters[parameterName];
    const nu = new MPEvent(this.eventType, nuData);
    console.log(nu);
    return nu.removeCustomParameter(parameterName);
  }
}
