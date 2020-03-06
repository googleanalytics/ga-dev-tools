import {
  MPEventType,
  MPEventData,
  emptyEvent,
  Parameter,
  Parameters,
  ParameterType
} from "./events";

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
    return MPEvent.empty(MPEventType.Purchase);
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

  static parameterToPayload = (parameter: Parameter): {} | "unset" => {
    switch (parameter.type) {
      case ParameterType.OptionalString:
        if (parameter.value === "") {
          return "unset";
        } else {
          return { [parameter.name]: parameter.value };
        }
      case ParameterType.RequiredArray:
        return {
          [parameter.name]: parameter.value.map(item =>
            Object.values(item.parameters)
              .concat(Object.values(item.customParameters))
              .map(MPEvent.parameterToPayload)
              .reduce((itemsPayload: {}, itemParam) => {
                if (itemParam === "unset") {
                  return itemsPayload;
                } else {
                  return {
                    ...itemsPayload,
                    ...itemParam
                  };
                }
              }, {})
          )
        };
    }
  };

  asPayload(): {} {
    const params = this.getParameters()
      .concat(this.getCustomParameters())
      .map(MPEvent.parameterToPayload)
      .reduce((payload: {}, parameter) => {
        if (parameter === "unset") {
          return payload;
        } else {
          return {
            ...payload,
            ...parameter
          };
        }
      }, {});
    return {
      name: this.getEventType(),
      params
    };
  }

  updateParameters(update: (old: Parameters) => Parameters): MPEvent {
    const nuData = { ...this.eventData };
    const nuParameters = update(nuData.parameters);
    nuData.parameters = nuParameters;
    return new MPEvent(this.eventType, nuData);
  }

  updateCustomParameters(update: (old: Parameters) => Parameters): MPEvent {
    const nuData = { ...this.eventData };
    const nuCustomParameters = update(nuData.customParameters);
    nuData.customParameters = nuCustomParameters;
    console.log("in MPEvent", { nuData });
    return new MPEvent(this.eventType, nuData);
  }

  // TODO - I can probably delete these update parameter functions now.
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

  getParameters(): Parameter[] {
    return Object.values<Parameter>(this.eventData.parameters);
  }
  getCustomParameters(): Parameter[] {
    return Object.values<Parameter>(this.eventData.customParameters);
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
