import {
  MPEventType,
  MPEventCategory,
  MPEventData,
  emptyEvent,
  Parameter,
  Parameters,
  ParameterType,
  eventTypesFor
} from "./events";

export class MPEvent {
  private eventType: MPEventType;
  private eventData: MPEventData;
  private name?: string;

  static eventTypes = (category: MPEventCategory): MPEventType[] => {
    return eventTypesFor(category);
  };

  static categories = (): MPEventCategory[] => {
    return Object.values(MPEventCategory);
  };

  static parameterTypeOptions = (): ParameterType[] => {
    return Object.values(ParameterType);
  };

  static eventTypeFromString = (eventType: string): MPEventType | undefined => {
    const assumed: MPEventType = eventType as MPEventType;
    switch (assumed) {
      case MPEventType.CustomEvent:
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
      case MPEventType.EarnVirtualCurrency:
      case MPEventType.TutorialBegin:
      case MPEventType.TutorialComplete:
      case MPEventType.AddPaymentInfo:
      case MPEventType.AddToCart:
      case MPEventType.AddToWishlist:
      case MPEventType.BeginCheckout:
      case MPEventType.EcommercePurchase:
      case MPEventType.GenerateLead:
      case MPEventType.PurchaseRefund:
      case MPEventType.ViewItem:
      case MPEventType.ViewItemList:
      case MPEventType.ViewSearchResults:
      case MPEventType.LevelUp:
      case MPEventType.PostScore:
      case MPEventType.UnlockAchievement:
      case MPEventType.AdReward:
      case MPEventType.AppException:
      case MPEventType.AppStoreRefund:
      case MPEventType.AppStoreSubscriptionCancel:
      case MPEventType.AppStoreSubscriptionConvert:
      case MPEventType.AppStoreSubscriptionRenew:
      case MPEventType.DynamicLinkAppOpen:
      case MPEventType.DynamicLinkAppUpdate:
      case MPEventType.DynamicLinkFirstOpen:
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

  clone(): MPEvent {
    const clonedData = { ...this.eventData };
    const nuEvent = new MPEvent(this.eventType, clonedData);
    nuEvent.name = this.name;
    return nuEvent;
  }

  getCategories(): MPEventCategory[] {
    return MPEvent.categories().filter(category =>
      MPEvent.eventTypes(category).find(a => a === this.getEventType())
    );
  }

  getEventData(): MPEventData {
    return this.eventData;
  }

  getEventType(): MPEventType {
    return this.eventType;
  }
  getEventName(): string {
    if (this.isCustomEvent()) {
      return this.name || "";
    } else {
      return this.eventData.type;
    }
  }

  isCustomEvent(): boolean {
    return this.eventType === MPEventType.CustomEvent;
  }

  static parameterToPayload = (parameter: Parameter): {} | "unset" => {
    switch (parameter.type) {
      case ParameterType.Number:
        if (parameter.value === undefined) {
          return "unset";
        }
        return { [parameter.name]: parameter.value };
      case ParameterType.String:
        if (parameter.value === "" || parameter.value === undefined) {
          return "unset";
        }
        return { [parameter.name]: parameter.value };
      case ParameterType.Items:
        return {
          [parameter.name]: parameter.value.map(item =>
            Object.values(item.parameters)
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
      name: this.getEventName(),
      params
    };
  }

  updateName(nuName: string): MPEvent {
    if (!this.isCustomEvent()) {
      throw new Error("Only custom events can update their name");
    }
    const nuEvent = this.clone();
    nuEvent.name = nuName;
    return nuEvent;
  }

  static hasDuplicateNames = (parameters: Parameters): boolean => {
    const nameSet = new Set(parameters.map(p => p.name));
    return nameSet.size !== parameters.length;
  };

  // This method might be making other stuff too difficult, but it works for
  // now...
  updateParameters(update: (old: Parameters) => Parameters): MPEvent {
    const nuEvent = this.clone();
    const nuParameters = update(nuEvent.eventData.parameters);
    if (MPEvent.hasDuplicateNames(nuParameters)) {
      return nuEvent;
    }
    nuEvent.eventData.parameters = nuParameters;
    return nuEvent;
  }

  getParameters(): Parameter[] {
    return Object.values<Parameter>(this.eventData.parameters);
  }

  // TODO - remove parameterName argument.
  addParameter(parameterName: string, parameter: Parameter): MPEvent {
    const alreadyHasParameter =
      this.eventData.parameters.find(p => p.name === parameter.name) !==
      undefined;
    if (alreadyHasParameter) {
      return this;
    }
    const nuEvent = this.clone();
    nuEvent.eventData.parameters.push(parameter);
    return nuEvent;
  }

  removeParameter(parameterName: string): MPEvent {
    const nuEvent = this.clone();
    const nuParameters = nuEvent.eventData.parameters.filter(
      a => a.name !== parameterName
    );
    nuEvent.eventData.parameters = nuParameters;
    return nuEvent;
  }

  updateParameterName(parameterName: string, newName: string): MPEvent {
    const nuEvent = this.clone();
    const nuParameters: Parameters = (nuEvent.eventData
      .parameters as Parameters).map((a: Parameter) =>
      a.name === parameterName ? { ...a, name: newName } : a
    );
    if (MPEvent.hasDuplicateNames(nuParameters)) {
      return this;
    }
    nuEvent.eventData.parameters = nuParameters;
    return nuEvent;
  }
}
