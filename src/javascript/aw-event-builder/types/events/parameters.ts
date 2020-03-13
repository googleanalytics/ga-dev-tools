export interface Item {
  parameters: Parameters;
}

export enum ParameterType {
  String = "string",
  Number = "number",
  Items = "items"
}

export type OptionalString<T = string> = {
  type: ParameterType.String;
  value?: string;
  name: T;
};

export const defaultOptionalString = <T = string>(
  name: T
): OptionalString<T> => ({
  type: ParameterType.String,
  value: "",
  name
});

export type ItemArray = {
  type: ParameterType.Items;
  // TODO - this can just be Parameters instead of Item[].
  value: Item[];
  // This name should always be 'items', but it makes typechcking things really
  // tricky.
  name: string;
};

export const defaultItemArray = (): ItemArray => ({
  type: ParameterType.Items,
  value: [],
  name: "items"
});

export type OptionalNumber<T = string> = {
  type: ParameterType.Number;
  required: false;
  value?: number;
  name: T;
};

export const defaultOptionalNumber = (name: string): OptionalNumber => ({
  type: ParameterType.Number,
  required: false,
  value: undefined,
  name
});

export const defaultParameterFor = (
  type: ParameterType,
  name: string
): Parameter => {
  switch (type) {
    case ParameterType.Items:
      return defaultItemArray();
    case ParameterType.String:
      return defaultOptionalString(name);
    case ParameterType.Number:
      return defaultOptionalNumber(name);
  }
};

export type Parameter =
  | OptionalString<string>
  | ItemArray
  | OptionalNumber<string>;

export type Parameters = Parameter[];

export type SuggestedParameters<T extends Parameter> = (T | Parameter)[];
