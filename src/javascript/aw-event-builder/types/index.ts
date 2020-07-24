import { MPEvent } from "./MpEvent";
import { Parameters } from "./events";

export * from "./MpEvent";
export * from "./events";

export enum ActionType {
  SetNonPersonalizedAds = "SetNonPersonalizedAds",
  SetTimestampMicros = "SetTimestampMicros",
  SetValidationStatus = "SetValidationStatus",
  SetMeasurementId = "SetMeasurementId",
  SetFirebaseAppId = "SetFirebaseAppId",
  SetClientId = "SetClientId",
  SetAppInstanceId = "SetAppInstanceId",
  SetUserId = "SetUserId",
  SetAuthKey = "SetAPISecret",
  SetEvent = "SetEvent",
  SetAuthorized = "SET_AUTHORIZED",
  AddParam = "ADD_PARAM",
  RemoveParam = "REMOVE_PARAM",
  EditParamName = "EDIT_PARAM_NAME",
  EditParamValue = "EDIT_PARAM_VALUE",
  ReplaceParams = "REPLACE_PARAMS",
  SetUserProperties = "SET_USER_PROPERTIES",
  SetValidationMessages = "SET_VALIDATION_MESSAGES",
}

export interface SetNonPersonalizedAds {
  type: ActionType.SetNonPersonalizedAds;
  nonPersonalizedAds: boolean;
}

export interface SetTimestampMicros {
  type: ActionType.SetTimestampMicros;
  timestampMicros: number | null;
}

export interface SetUserProperties {
  type: ActionType.SetUserProperties;
  userProperties: Parameters;
}

export interface SetAuthorized {
  type: ActionType.SetAuthorized;
}

export interface AddParam {
  type: ActionType.AddParam;
}

export interface RemoveParam {
  type: ActionType.RemoveParam;
  id: number;
}

export interface EditParamName {
  type: ActionType.EditParamName;
  name: string;
  id: number;
}

export interface EditParamValue {
  type: ActionType.EditParamValue;
  value: string;
  id: number;
}

export interface ReplaceParams {
  type: ActionType.ReplaceParams;
  params: Params;
}

export interface SetValidationMessages {
  type: ActionType.SetValidationMessages;
  validationMessages: ValidationMessage[];
}

export interface SetEvent {
  type: ActionType.SetEvent;
  event: MPEvent;
}

export interface SetAPISecret {
  type: ActionType.SetAuthKey;
  api_secret: string;
}
export interface SetClientId {
  type: ActionType.SetClientId;
  clientId: string;
}
export interface SetAppInstanceId {
  type: ActionType.SetAppInstanceId;
  appInstanceId: string;
}
export interface SetUserId {
  type: ActionType.SetUserId;
  userId: string;
}
export interface SetMid {
  type: ActionType.SetMeasurementId;
  measurement_id: string;
}
export interface SetValidationStatus {
  type: ActionType.SetValidationStatus;
  validationStatus: ValidationStatus;
}
export interface SetFirebaseAppId {
  type: ActionType.SetFirebaseAppId;
  firebase_app_id: string;
}

export type EventBuilderAction =
  | SetNonPersonalizedAds
  | SetTimestampMicros
  | SetUserProperties
  | SetFirebaseAppId
  | SetValidationStatus
  | SetMid
  | SetAppInstanceId
  | SetClientId
  | SetUserId
  | SetAPISecret
  | SetEvent
  | SetAuthorized
  | AddParam
  | RemoveParam
  | EditParamName
  | EditParamValue
  | ReplaceParams
  | SetValidationMessages;

export enum RequiredParams {
  V = "v",
  T = "t",
  T_Id = "tid",
  C_Id = "cid",
}

export enum UrlParam {
  UserProperties = "userProperties",
}

export type ParamV = ParamType<RequiredParams.V>;
export type ParamT = ParamType<RequiredParams.T>;
export type ParamTId = ParamType<RequiredParams.T_Id>;
export type ParamCId = ParamType<RequiredParams.C_Id>;
export type ParamOptional = ParamType<string>;

export type Params = [ParamV, ParamT, ParamTId, ParamCId, ...ParamOptional[]];

export type Param =
  | ParamType<RequiredParams.V>
  | ParamType<RequiredParams.T>
  | ParamType<RequiredParams.T_Id>
  | ParamType<RequiredParams.C_Id>
  | ParamType<string>;

interface ParamType<T> {
  id: number;
  name: T;
  value: string | string[];
  required?: true;
  isOptional?: true;
}

export enum ValidationStatus {
  Valid = "VALID",
  Pending = "PENDING",
  Invalid = "INVALID",
  Unset = "UNSET",
}

export interface ValidationMessage {
  fieldPath: string;
  description: string;
  validationCode: string;
}

export interface State {
  validationStatus: ValidationStatus;
  measurementId: string;
  firebaseAppId: string;
  clientId: string;
  appInstanceId: string;
  userId: string;
  apiSecret: string;
  timestampMicros: number | null;
  nonPersonalizedAds: boolean;
  event: MPEvent;
  userProperties: Parameters;
  isAuthorized: boolean;
  validationMessages: ValidationMessage[];
}
