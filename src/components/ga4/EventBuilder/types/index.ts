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

import { MPEvent } from "./MPEvent"
import { Parameters } from "./events"

export * from "./MpEvent"
export * from "./events"

export enum UrlParam {
  UseFirebase = "use_firebase",
  TimestampMicros = "timestamp_micros",
  NonPersonalizedAds = "non_personalized_ads",
  EventData = "event_data",
  FirebaseAppId = "firebase_app_id",
  MeasurementId = "measurement_id",
  EventName = "event_name",
  APISecret = "api_secret",
  UserId = "user_id",
  UserProperties = "user_properties",
  ClientId = "client_id",
  AppInstanceId = "app_instance_id",
}

export enum ValidationStatus {
  Valid = "VALID",
  Pending = "PENDING",
  Invalid = "INVALID",
  Unset = "UNSET",
}

export interface ValidationMessage {
  fieldPath: string
  description: string
  validationCode: string
}

interface WebIds {
  type: "web"
  client_id?: string
  user_id?: string
}

interface MobileIds {
  type: "mobile"
  app_instance_id?: string
  user_id?: string
}

export type ClientIds = WebIds | MobileIds

export interface InstanceId {
  measurement_id?: string
  firebase_app_id?: string
}

export interface URLParts {
  use_firebase?: boolean
  event_name?: string
  client_id?: string
  app_instance_id?: string
  user_id?: string
  event?: MPEvent
  measurement_id?: string
  firebase_app_id?: string
  api_secret?: string
  user_properties?: Parameters
  timestamp_micros?: string
  non_personalized_ads?: boolean
}
