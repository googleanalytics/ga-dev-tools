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

export type OptionalString = {
  type: ParameterType.OptionalString;
  required: false;
  value?: string;
  name: string;
};

export const defaultOptionalString = (name: string): OptionalString => ({
  type: ParameterType.OptionalString,
  required: false,
  value: "",
  name
});

export type ItemArray = {
  type: ParameterType.RequiredArray;
  required: true;
  value: Item[];
  name: string;
};

export const defaultItemArray = (name: string): ItemArray => ({
  type: ParameterType.RequiredArray,
  required: true,
  value: [],
  name
});

export type OptionalNumber = {
  type: ParameterType.OptionalNumber;
  required: false;
  value?: number;
  name: string;
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
      return defaultItemArray(name);
    case ParameterType.OptionalString:
      return defaultOptionalString(name);
    case ParameterType.OptionalNumber:
      return defaultOptionalNumber(name);
  }
};

export type Parameter = OptionalString | ItemArray | OptionalNumber;

export type Parameters = { [paramName: string]: Parameter };
