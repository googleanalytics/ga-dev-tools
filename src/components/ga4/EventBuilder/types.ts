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
  AdImpression = "ad_impression",
  AddPaymentInfo = "add_payment_info",
  AddShippingInfo = "add_shipping_info",
  AddToCart = "add_to_cart",
  AddToWishlist = "add_to_wishlist",
  BeginCheckout = "begin_checkout",
  CampaignDetails = "campaign_details",
  EarnVirtualCurrency = "earn_virtual_currency",
  GenerateLead = "generate_lead",
  JoinGroup = "join_group",
  LevelUp = "level_up",
  Login = "login",
  PostScore = "post_score",
  Purchase = "purchase",
  Refund = "refund",
  RemoveFromCart = "remove_from_cart",
  ScreenView = "screen_view",
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

export enum Label {
  APISecret = "api secret",

  FirebaseAppID = "firebase app id",
  AppInstanceID = "app instance id",

  MeasurementID = "measurement id",
  ClientID = "client id",

  UserId = "user id",

  EventCategory = "event category",
  EventName = "event name",
  TimestampMicros = "timestamp micros",
  NonPersonalizedAds = "non personalized ads",

  Payload = "payload",

  // event params
  Coupon = "#/events/0/params/coupon",
  Currency = "#/events/0/params/currency",
  Value = "#/events/0/params/value",
  ItemId = "#/events/0/params/item_id",
  TransactionId = "#/events/0/params/transaction_id",
  Affiliation = "#/events/0/params/affiliation",
  Shipping = "#/events/0/params/shipping",
  Tax = "#/events/0/params/tax",

  // Geographic Information
  IpOverride = "ip address",
  City = "city",
  RegionId = "region id",
  CountryId = "country id",
  SubcontinentId = "subcontinent id",
  ContinentId = "continent id",
}

// TODO - Add test to ensure url param values are all unique.
export enum UrlParam {
  Parameters = "parameters",
  Items = "items",
  EventType = "event_type",
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
  Version = "version",
  UseTextBox = "use_text_box",
  Payload = "payload",
  PayloadObj = "payload_obj",
  PayloadError = "payload_error",
  IpOverride = "ip_override",
  UserLocationCity = "user_location_city",
  UserLocationRegionId = "user_location_region_id",
  UserLocationCountryId = "user_location_country_id",
  UserLocationSubcontinentId = "user_location_subcontinent_id",
  UserLocationContinentId = "user_location_continent_id",
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
  documentation?: string
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
  [UrlParam.IpOverride]?: string
  [UrlParam.UserLocationCity]?: string
  [UrlParam.UserLocationRegionId]?: string
  [UrlParam.UserLocationCountryId]?: string
  [UrlParam.UserLocationSubcontinentId]?: string
  [UrlParam.UserLocationContinentId]?: string
}
