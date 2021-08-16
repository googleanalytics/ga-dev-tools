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

export enum ParameterType {
  String = "string",
  Number = "number",
}

export enum Category {
  Custom = "Custom",
  AllApps = "All apps",
  RetailEcommerce = "Retail/Ecommerce",
  Jobs_Edu_LocalDeails_RealEstate = "Jobs, Education, Local Deals, Real Estate",
  Travel = "Travel (Hotel/Air)",
  Games = "Games",
}

export enum EventType {
  CustomEvent = "custom_event",

  AddPaymentInfo = "add_payment_info",
  AddShippingInfo = "add_shipping_info",
  AddToCart = "add_to_cart",
  AddToWishlist = "add_to_wishlist",
  BeginCheckout = "begin_checkout",
  EarnVirtualCurrency = "earn_virtual_currency",
  GenerateLead = "generate_lead",
  JoinGroup = "join_group",
  LevelUp = "level_up",
  Login = "login",
  PostScore = "post_score",
  Purchase = "purchase",
  Refund = "refund",
  RemoveFromCart = "remove_from_cart",
  Search = "search",
  SelectContent = "select_content",
  SelectItem = "select_item",
  SelectPromotion = "select_promotion",
  Share = "share",
  SignUp = "sign_up",
  SpendVirtualCurrency = "spend_virtual_currency",
  TutorialBegin = "tutorial_begin",
  TutorialComplete = "tutorial_complete",
  UnlockAchievement = "unlock_achievement",
  ViewCart = "view_cart",
  ViewItem = "view_item",
  ViewItemList = "view_item_list",
  ViewPromotion = "view_promotion",
  ViewSearchResults = "view_search_results",
}

export interface NumberParameter {
  type: ParameterType.Number
  name: string
  value: string | undefined
  exampleValue?: number
}
export interface StringParameter {
  type: ParameterType.String
  name: string
  value: string | undefined
  exampleValue?: string
}

export type Parameter = NumberParameter | StringParameter

export interface Event2 {
  type: EventType
  categories: Category[]
  parameters: Parameter[]
  items?: Parameter[][]
}

// TODO - Add test to ensure url param values are all unique.
export enum UrlParam {
  Parameters = "a",
  Items = "b",
  EventType = "c",
  UseFirebase = "d",
  TimestampMicros = "e",
  NonPersonalizedAds = "f",
  EventData = "g",
  FirebaseAppId = "h",
  MeasurementId = "i",
  EventName = "j",
  APISecret = "k",
  UserId = "l",
  UserProperties = "m",
  ClientId = "n",
  AppInstanceId = "o",
  Version = "p",
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

export interface WebIds {
  client_id?: string
  user_id?: string
}

export interface MobileIds {
  app_instance_id?: string
  user_id?: string
}

export type ClientIds = WebIds | MobileIds

export interface InstanceId {
  measurement_id?: string
  firebase_app_id?: string
}

export interface URLParts {
  [UrlParam.EventName]?: string
  [UrlParam.UseFirebase]?: boolean
  [UrlParam.ClientId]?: string
  [UrlParam.AppInstanceId]?: string
  [UrlParam.UserId]?: string
  [UrlParam.Parameters]?: Parameter[]
  [UrlParam.UserProperties]?: Parameter[]
  [UrlParam.Items]?: Parameter[][]
  [UrlParam.MeasurementId]?: string
  [UrlParam.FirebaseAppId]?: string
  [UrlParam.APISecret]?: string
  [UrlParam.TimestampMicros]?: string
  [UrlParam.NonPersonalizedAds]?: boolean
}
