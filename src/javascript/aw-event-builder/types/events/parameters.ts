export interface Item {
  parameters: {
    name: OptionalString;
  };
  customParameters: {};
}

export enum ParameterType {
  OptionalString = "optional string",
  OptionalNumber = "optional number",
  RequiredArray = "required array"
}

export type OptionalString<T = string> = {
  type: ParameterType.OptionalString;
  value?: string;
  name: T;
};

export const defaultOptionalString = <T = string>(
  name: T
): OptionalString<T> => ({
  type: ParameterType.OptionalString,
  value: "",
  name
});

export type ItemArray = {
  type: ParameterType.RequiredArray;
  value: Item[];
  name: "items";
};

export const defaultItemArray = (): ItemArray => ({
  type: ParameterType.RequiredArray,
  value: [],
  name: "items"
});

export type OptionalNumber<T = string> = {
  type: ParameterType.OptionalNumber;
  required: false;
  value?: number;
  name: T;
};

export const defaultOptionalNumber = (name: string): OptionalNumber => ({
  type: ParameterType.OptionalNumber,
  required: false,
  value: undefined,
  name
});

export const defaultParameterFor = (
  type: ParameterType,
  name: string
): Parameter => {
  switch (type) {
    case ParameterType.RequiredArray:
      return defaultItemArray();
    case ParameterType.OptionalString:
      return defaultOptionalString(name);
    case ParameterType.OptionalNumber:
      return defaultOptionalNumber(name);
  }
};

export type Parameter =
  | OptionalString<string>
  | ItemArray
  | OptionalNumber<string>;

export type Parameters = Parameter[];

export type SuggestedParameters<T extends Parameter> = (T | Parameter)[];
