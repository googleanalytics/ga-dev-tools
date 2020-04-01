export interface Item {
  parameters: Parameters;
}

export enum ParameterType {
  String = "string",
  Number = "number",
  Items = "items"
}

export type StringParam<T = string> = {
  type: ParameterType.String;
  value?: string;
  name: T;
  isUserProperty: boolean;
  timestampMicros?: number;
};

export const defaultStringParam = <T = string>(
  name: T,
  isUserProperty = false
): StringParam<T> => ({
  type: ParameterType.String,
  value: "",
  name,
  isUserProperty
});

export type ItemArrayParam = {
  type: ParameterType.Items;
  // TODO - this can just be Parameters instead of Item[].
  value: Item[];
  // This name should always be 'items', but it makes typechcking things really
  // tricky.
  name: string;
  isUserProperty: boolean;
  timestampMicros?: number;
};

export const defaultItemArrayParam = (
  isUserProperty = false
): ItemArrayParam => ({
  type: ParameterType.Items,
  value: [],
  name: "items",
  isUserProperty
});

export type NumberParam<T = string> = {
  type: ParameterType.Number;
  required: false;
  value?: number;
  name: T;
  isUserProperty: boolean;
  timestampMicros?: number;
};

export const defaultNumberParam = (
  name: string,
  isUserProperty = false
): NumberParam => ({
  type: ParameterType.Number,
  required: false,
  value: undefined,
  name,
  isUserProperty
});

export const defaultParameterFor = (
  type: ParameterType,
  name: string
): Parameter => {
  switch (type) {
    case ParameterType.Items:
      return defaultItemArrayParam();
    case ParameterType.String:
      return defaultStringParam(name);
    case ParameterType.Number:
      return defaultNumberParam(name);
  }
};

export type Parameter =
  | StringParam<string>
  | ItemArrayParam
  | NumberParam<string>;

export type Parameters = Parameter[];

export type SuggestedParameters<T extends Parameter> = (T | Parameter)[];
