import { MPEvent } from "./MpEvent";

export * from "./MpEvent";
export * from "./events";

export enum ActionType {
  SetValidationStatus = "SetValidationStatus",
  SetMid = "SetMid",
  SetClientId = "SetClientId",
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
  SetValidationMessages = "SET_VALIDATION_MESSAGES"
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

export interface SetUserProperties {
  type: ActionType.SetUserProperties;
  properties: Property[];
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
  auth_key: string;
}
export interface SetClientId {
  type: ActionType.SetClientId;
  client_id: string;
}
export interface SetUserId {
  type: ActionType.SetUserId;
  user_id: string;
}
export interface SetMid {
  type: ActionType.SetMid;
  mid: string;
}
export interface SetValidationStatus {
  type: ActionType.SetValidationStatus;
  validationStatus: ValidationStatus;
}

export type EventBuilderAction =
  | SetValidationStatus
  | SetMid
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
  | SetUserProperties
  | SetValidationMessages;

export enum RequiredParams {
  V = "v",
  T = "t",
  T_Id = "tid",
  C_Id = "cid"
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

export interface Property {
  name: string;
  id: number;
  group: string;
}

export enum ValidationStatus {
  Valid = "VALID",
  Pending = "PENDING",
  Invalid = "INVALID",
  Unset = "UNSET"
}

export interface ValidationMessage {
  fieldPath: string;
  description: string;
  validationCode: string;
}

export interface State {
  validationStatus: ValidationStatus;
  mid: string;
  client_id: string;
  user_id: string;
  auth_key: string;
  event: MPEvent;
  isAuthorized: boolean;
  properties: Property[];
  validationMessages: ValidationMessage[];
}
