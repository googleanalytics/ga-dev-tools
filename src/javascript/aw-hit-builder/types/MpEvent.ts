export enum MPEventType {
  CampaignEvent = "campaign-event",
  PageView = "page-view"
}

interface PageViewEvent {
  type: MPEventType.PageView;
}

interface CampaignEvent {
  type: MPEventType.CampaignEvent;
  source: string;
  medium: string;
  name: string;
  term: string;
  content: string;
  id: string;
}

type MPEventData = CampaignEvent | PageViewEvent;

export class MPEvent {
  private eventType: MPEventType;
  private eventData: Partial<MPEventData>;

  static options = (): MPEventType[] => {
    return Object.values(MPEventType);
  };

  static empty = (eventType: MPEventType) => {
    return new MPEvent(eventType);
  };

  static default = () => {
    return new MPEvent(MPEventType.PageView);
  };

  constructor(eventType: MPEventType) {
    this.eventType = eventType;
    this.eventData = {};
  }

  getEventType(): MPEventType {
    return this.eventType;
  }
}
