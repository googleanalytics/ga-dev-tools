import { StringParam } from "./parameters";
import { MPEventType, EventData } from "./index";

export type GamesEvent = LevelUpEvent | PostScoreEvent | UnlockAchievementEvent;

type LevelUpEvent = EventData<
  MPEventType.LevelUp,
  StringParam<"character"> | StringParam<"level">
>;
type PostScoreEvent = EventData<
  MPEventType.PostScore,
  StringParam<"level"> | StringParam<"character"> | StringParam<"score">
>;

type UnlockAchievementEvent = EventData<
  MPEventType.UnlockAchievement,
  StringParam<"achievement_id">
>;
