// Copyright 2016 Google Inc. All rights reserved.
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

import * as types from "./types";

enum HitStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  UNVALIDATED = "UNVALIDATED"
}

interface HitStatusAction {
  type: typeof types.SET_HIT_STATUS;
  status: HitStatus;
}

/**
 * Returns the SET_HIT_STATUS action type with the new status.
 * @return {Object}
 */
export function setHitStatus(status: HitStatus): HitStatusAction {
  return { type: types.SET_HIT_STATUS, status };
}
