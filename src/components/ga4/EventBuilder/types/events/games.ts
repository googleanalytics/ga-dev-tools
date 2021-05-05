// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { EventData, MPEventType } from "."
import { StringParam } from "./parameters"

export type GamesEvent = LevelUpEvent | PostScoreEvent | UnlockAchievementEvent

type LevelUpEvent = EventData<
  MPEventType.LevelUp,
  StringParam<"character"> | StringParam<"level">
>
type PostScoreEvent = EventData<
  MPEventType.PostScore,
  StringParam<"level"> | StringParam<"character"> | StringParam<"score">
>

type UnlockAchievementEvent = EventData<
  MPEventType.UnlockAchievement,
  StringParam<"achievement_id">
>
