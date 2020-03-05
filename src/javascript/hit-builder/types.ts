export enum ActionType {
  SetHitPayload = "SET_HIT_PAYLOAD",
  SetHitStatus = "SET_HIT_STATUS",
  SetAuthorized = "SET_AUTHORIZED",
  AddParam = "ADD_PARAM",
  RemoveParam = "REMOVE_PARAM",
  EditParamName = "EDIT_PARAM_NAME",
  EditParamValue = "EDIT_PARAM_VALUE",
  ReplaceParams = "REPLACE_PARAMS",
  SetUserProperties = "SET_USER_PROPERTIES",
  SetValidationMessages = "SET_VALIDATION_MESSAGES"
}

export interface SetHitStatus {
  type: ActionType.SetHitStatus;
  status: HitStatus;
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

export interface SetHitPayload {
  type: ActionType.SetHitPayload;
  hitPayload: string;
}

export type HitAction =
  | SetHitStatus
  | SetAuthorized
  | AddParam
  | RemoveParam
  | EditParamName
  | EditParamValue
  | ReplaceParams
  | SetUserProperties
  | SetValidationMessages
  | SetHitPayload;

export enum HitStatus {
  Unvalidated = "UNVALIDATED",
  Validating = "VALIDATING",
  Valid = "VALID",
  Invalid = "INVALID"
}

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
export interface ValidationMessage {
  param: string;
  description: string;
}

export interface State {
  hitPayload: string;
  hitStatus: HitStatus;
  isAuthorized: boolean;
  params: Params;
  properties: Property[];
  validationMessages: ValidationMessage[];
}
