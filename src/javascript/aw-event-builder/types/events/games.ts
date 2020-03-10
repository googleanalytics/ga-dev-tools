import { OptionalString } from "./parameters";
import { MPEventType } from "./index";

export type GamesEvent = LevelUpEvent | PostScoreEvent | UnlockAchievementEvent;

interface LevelUpEvent {
  type: MPEventType.LevelUp;
  parameters: { character: OptionalString; level: OptionalString };
  customParameters: {};
}

interface PostScoreEvent {
  type: MPEventType.PostScore;
  parameters: {
    level: OptionalString;
    character: OptionalString;
    score: OptionalString;
  };
  customParameters: {};
}

interface UnlockAchievementEvent {
  type: MPEventType.UnlockAchievement;
  parameters: { achievement_id: OptionalString };
  customParameters: {};
}
