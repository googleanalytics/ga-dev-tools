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

declare module "*.svg" {
  import { HTMLAttributes } from "react"
  const value: React.ComponentType<
    HTMLAttributes<SVGElement> & { viewBox?: string }
  >
  export default value
}

declare module "*.module.css";

declare interface AppState {
  user?: gapi.auth2.GoogleUser
  gapi?: typeof gapi
  gapiStatus?: string
  measurementID: string
}
