export enum ActionType {
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
  params: Param[];
}

export interface SetUserProperties {
  type: ActionType.SetUserProperties;
  properties: Property[];
}

export interface SetValidationMessages {
  type: ActionType.SetValidationMessages;
  validationMessages: ValidationMessage[];
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
  | SetValidationMessages;

export enum HitStatus {
  Unvalidated = "UNVALIDATED"
}

export interface Param {
  id: number;
  name: string;
  value: string;
}
export interface Property {}
export interface ValidationMessage {}

export interface State {
  hitStatus: HitStatus;
  isAuthorized: boolean;
  params: Param[];
  properties: Property[];
  validationMessages: ValidationMessage[];
}
