import { OptionalString } from "./parameters";
import { MPEventType, EventData } from "./index";

export type GamesEvent = LevelUpEvent | PostScoreEvent | UnlockAchievementEvent;

type LevelUpEvent = EventData<
  MPEventType.LevelUp,
  OptionalString<"character"> | OptionalString<"level">
>;
type PostScoreEvent = EventData<
  MPEventType.PostScore,
  | OptionalString<"level">
  | OptionalString<"character">
  | OptionalString<"score">
>;

type UnlockAchievementEvent = EventData<
  MPEventType.UnlockAchievement,
  OptionalString<"achievement_id">
>;
