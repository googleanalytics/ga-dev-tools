import { MPEvent } from "./_MpEvent"
import { Parameters } from "./_events/_index"

export * from "./_MpEvent"
export * from "./_events/_index"

export enum UrlParam {
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
